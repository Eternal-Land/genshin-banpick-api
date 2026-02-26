import {
	AccountRepository,
	MatchParticipantRepository,
	MatchRepository,
	MatchSessionRepository,
} from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { GenshinBanpickCls } from "@utils";
import { ClsService } from "nestjs-cls";
import { Transactional } from "typeorm-transactional";
import { CreateMatchRequest, MatchQuery, UpdateMatchRequest } from "./dto";
import { MatchAlreadyStartedError, MatchNotFoundError } from "./errors";
import { MatchEntity } from "@db/entities";

interface FindOneOptions {
	isHost?: boolean;
	isNotStarted?: boolean;
}

@Injectable()
export class MatchService {
	constructor(
		private readonly matchRepository: MatchRepository,
		private readonly matchSessionRepository: MatchSessionRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
		private readonly accountRepository: AccountRepository,
		private readonly matchParticipantRepository: MatchParticipantRepository,
	) {}

	@Transactional()
	async createOne(dto: CreateMatchRequest) {
		const hostId = this.cls.get("profile.id");

		const match = await this.matchRepository.save({
			hostId,
			sessionCount: dto.sessionCount,
			name: dto.name,
		});

		if (dto.isParticipant) {
			await this.matchParticipantRepository.save({
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

		return this.matchRepository.save(match);
	}

	async findMany(query: MatchQuery) {
		const matchQb = this.matchRepository
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
		const matchParticipants = await this.matchParticipantRepository.find({
			where: { matchId: match.id },
			relations: {
				participant: true,
			},
		});
		match.participants = matchParticipants;
	}

	async findOne(id: string, options: FindOneOptions = {}) {
		const hostId = this.cls.get("profile.id");
		const match = await this.matchRepository.findOne({
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
		if (options.isNotStarted) {
			const sessionCount = await this.matchSessionRepository.count({
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
			this.matchRepository.delete(id),
			this.matchParticipantRepository.delete({ matchId: id }),
		]);
	}
}
