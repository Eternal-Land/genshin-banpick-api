import { MatchParticipantRepository, MatchRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { GenshinBanpickCls } from "@utils";
import { ClsService } from "nestjs-cls";
import { Transactional } from "typeorm-transactional";
import { CreateMatchRequest, MatchQuery } from "./dto";
import {
	MatchAlreadyStartedError,
	MatchNotFoundError,
	MatchParticipantMustBeUniqueError,
} from "./errors";
import { MatchEntity } from "@db/entities";
import { SocketMatchService } from "@modules/socket/services";
import { SocketEvents } from "@utils/constants";
import { MatchStatus } from "@utils/enums";

interface FindOneOptions {
	isHost?: boolean;
	isNotStarted?: boolean;
}

@Injectable()
export class MatchService {
	constructor(
		private readonly matchRepo: MatchRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
		private readonly matchParticipantRepo: MatchParticipantRepository,
		private readonly socketMatchService: SocketMatchService,
	) {}

	@Transactional()
	async createOne(dto: CreateMatchRequest) {
		if (dto.participants[0] == dto.participants[1]) {
			throw new MatchParticipantMustBeUniqueError();
		}

		const hostId = this.cls.get("profile.id");

		const match = await this.matchRepo.save({
			hostId,
			sessionCount: dto.sessionCount,
			type: dto.type,
		});

		await this.matchParticipantRepo.save(
			dto.participants.map((participantId) => ({
				participantId,
				matchId: match.id,
			})),
		);

		return match;
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
			},
		});
		if (!match) {
			throw new MatchNotFoundError();
		}
		if (options.isNotStarted && match.status != MatchStatus.WAITING) {
			throw new MatchAlreadyStartedError();
		}

		return match;
	}

	@Transactional()
	async deleteOne(id: string) {
		await this.findOne(id, { isHost: true, isNotStarted: true });
		await Promise.all([
			this.matchRepo.delete(id),
			this.matchParticipantRepo.delete({ matchId: id }),
		]);
		this.socketMatchService.emitToMatch(id, SocketEvents.MATCH_DELETED);
	}
}
