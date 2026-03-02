import {
	MatchInvitationRepository,
	MatchParticipantRepository,
	MatchRepository,
	MatchSessionRepository,
} from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { GenshinBanpickCls } from "@utils";
import { ClsService } from "nestjs-cls";
import { Transactional } from "typeorm-transactional";
import {
	CreateMatchRequest,
	InviteParticipantRequest,
	MatchInvitationResponse,
	MatchQuery,
	UpdateMatchRequest,
} from "./dto";
import {
	AccountAlreadyAParticipantError,
	InvitationNotFoundError,
	MatchAlreadyStartedError,
	MatchInvitationExistedError,
	MatchNotFoundError,
} from "./errors";
import { MatchEntity } from "@db/entities";
import { SocketService } from "@modules/socket";
import { NotificationService } from "@modules/notification";
import { NotificationType, SocketEvents } from "@utils/constants";
import { ProfileResponse } from "@modules/self/dto";
import { PermissionDeniedError } from "@modules/auth/errors";

interface FindOneOptions {
	isHost?: boolean;
	isNotStarted?: boolean;
}

@Injectable()
export class MatchService {
	constructor(
		private readonly matchRepo: MatchRepository,
		private readonly matchSessionRepo: MatchSessionRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
		private readonly matchParticipantRepo: MatchParticipantRepository,
		private readonly matchInvitationRepo: MatchInvitationRepository,
		private readonly socketService: SocketService,
		private readonly notificationService: NotificationService,
	) {}

	@Transactional()
	async createOne(dto: CreateMatchRequest) {
		const hostId = this.cls.get("profile.id");

		const match = await this.matchRepo.save({
			hostId,
			sessionCount: dto.sessionCount,
			name: dto.name,
		});

		if (dto.isParticipant) {
			await this.matchParticipantRepo.save({
				participantId: hostId,
				matchId: match.id,
			});
		}

		return match;
	}

	@Transactional()
	async updateOne(id: string, dto: UpdateMatchRequest) {
		const match = await this.findOne(id, { isHost: true, isNotStarted: true });

		match.sessionCount = dto.sessionCount;
		match.name = dto.name;

		return this.matchRepo.save(match);
	}

	async findMany(query: MatchQuery) {
		const matchQb = this.matchRepo
			.createQueryBuilder("match")
			.innerJoinAndSelect("match.host", "host");

		if (query.accountId) {
			matchQb
				.leftJoin("match.participants", "participants")
				.andWhere(
					"match.hostId = :accountId OR participants.participantId = :accountId",
					{
						accountId: query.accountId,
					},
				);
		}

		if (query.search) {
			matchQb.andWhere("match.name LIKE :search", {
				search: `%${query.search}%`,
			});
		}

		const [items, total] = await Promise.all([
			matchQb
				.orderBy("match.createdAt", "DESC")
				.take(query.take)
				.skip((query.page - 1) * query.take)
				.getMany(),
			matchQb.getCount(),
		]);

		for (const item of items) {
			await this.populateParticipants(item);
		}

		return { items, total };
	}

	private async populateParticipants(match: MatchEntity) {
		const matchParticipants = await this.matchParticipantRepo.find({
			where: { matchId: match.id },
			relations: {
				participant: true,
			},
		});
		match.participants = matchParticipants;
	}

	async findOne(id: string, options: FindOneOptions = {}) {
		const hostId = this.cls.get("profile.id");
		const match = await this.matchRepo.findOne({
			where: options.isHost ? { id, hostId } : { id },
			relations: {
				host: true,
				participants: {
					participant: true,
				},
				invitations: {
					account: true,
				},
			},
		});
		if (!match) {
			throw new MatchNotFoundError();
		}
		if (options.isNotStarted) {
			const sessionCount = await this.matchSessionRepo.count({
				where: { matchId: id },
			});

			if (sessionCount > 0) {
				throw new MatchAlreadyStartedError();
			}
		}

		return match;
	}

	@Transactional()
	async deleteOne(id: string) {
		await this.findOne(id, { isHost: true, isNotStarted: true });
		await Promise.all([
			this.matchRepo.delete(id),
			this.matchParticipantRepo.delete({ matchId: id }),
			this.matchInvitationRepo.delete({ matchId: id }),
		]);
	}

	@Transactional()
	async inviteParticipant(dto: InviteParticipantRequest) {
		const match = await this.findOne(dto.matchId, {
			isHost: true,
			isNotStarted: true,
		});
		await this.populateParticipants(match);

		if (match.participants.some((p) => p.participantId === dto.accountId)) {
			throw new AccountAlreadyAParticipantError();
		}

		const matchInvitationExisted = await this.matchInvitationRepo.findOne({
			where: {
				matchId: dto.matchId,
				accountId: dto.accountId,
			},
		});
		if (matchInvitationExisted) {
			throw new MatchInvitationExistedError();
		}

		const insertResult = await this.matchInvitationRepo.insert({
			matchId: dto.matchId,
			accountId: dto.accountId,
		});

		const matchInvitation = await this.matchInvitationRepo.findOne({
			where: { id: insertResult.identifiers[0].id },
			relations: {
				account: true,
			},
		});
		matchInvitation.match = match;

		await this.notificationService.notify({
			userId: dto.accountId,
			content: JSON.stringify(
				MatchInvitationResponse.fromEntity(matchInvitation),
			),
			type: NotificationType.MATCH_INVITATION,
		});
	}

	@Transactional()
	async acceptInvitation(invitationId: string) {
		const currentAccountId = this.cls.get("profile.id");
		const invitation = await this.matchInvitationRepo.findOne({
			where: { id: invitationId },
			relations: {
				match: true,
				account: true,
			},
		});
		if (!invitation) {
			throw new InvitationNotFoundError();
		}
		if (invitation.accountId !== currentAccountId) {
			throw new PermissionDeniedError();
		}

		const sessionCount = await this.matchSessionRepo.count({
			where: { matchId: invitation.matchId },
		});
		if (sessionCount > 0) {
			throw new MatchAlreadyStartedError();
		}

		const match = invitation.match;
		if (!match) {
			throw new MatchNotFoundError();
		}
		await this.populateParticipants(match);

		if (
			match.participants.some((p) => p.participantId === invitation.accountId)
		) {
			throw new AccountAlreadyAParticipantError();
		}

		await this.matchParticipantRepo.save({
			matchId: match.id,
			participantId: invitation.accountId,
		});

		await this.matchInvitationRepo.delete(invitation.id);
		this.socketService.emitToMatch(
			invitation.matchId,
			SocketEvents.INVITATION_ACCEPTED,
			ProfileResponse.fromEntity(invitation.account),
		);
	}

	@Transactional()
	async denyInvitation(invitationId: string) {
		const currentAccountId = this.cls.get("profile.id");
		const invitation = await this.matchInvitationRepo.findOne({
			where: { id: invitationId },
			relations: {
				account: true,
			},
		});
		if (!invitation) {
			throw new InvitationNotFoundError();
		}
		if (invitation.accountId !== currentAccountId) {
			throw new PermissionDeniedError();
		}

		const sessionCount = await this.matchSessionRepo.count({
			where: { matchId: invitation.matchId },
		});
		if (sessionCount > 0) {
			throw new MatchAlreadyStartedError();
		}

		await this.matchInvitationRepo.delete(invitation.id);
		this.socketService.emitToMatch(
			invitation.matchId,
			SocketEvents.INVITATION_DENIED,
			ProfileResponse.fromEntity(invitation.account),
		);
	}
}
