import { MatchRepository, MatchStateRepository } from "@db/repositories";
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
		private readonly socketMatchService: SocketMatchService,
		private readonly matchStateRepo: MatchStateRepository,
	) {}

	@Transactional()
	async createOne(dto: CreateMatchRequest) {
		if (dto.redPlayerId == dto.bluePlayerId) {
			throw new MatchParticipantMustBeUniqueError();
		}

		const hostId = this.cls.get("profile.id");

		const match = await this.matchRepo.save({
			hostId,
			sessionCount: dto.sessionCount,
			type: dto.type,
			bluePlayerId: dto.bluePlayerId,
			redPlayerId: dto.redPlayerId,
		});

		await this.resetMatchState(match.id);

		return match;
	}

	private async resetMatchState(matchId: string) {
		const existed = await this.matchStateRepo.findOne({
			where: { matchId },
		});

		if (existed) {
			await this.matchStateRepo.delete({ matchId });
		}

		await this.matchStateRepo.save({
			matchId,
		});
	}

	async findMany(query: MatchQuery) {
		const matchQb = this.matchRepo
			.createQueryBuilder("match")
			.innerJoinAndSelect("match.host", "host");

		if (query.accountId) {
			matchQb
				.leftJoin("match.redPlayer", "redPlayer")
				.leftJoin("match.bluePlayer", "bluePlayer")
				.andWhere(
					"match.hostId = :accountId OR redPlayer.id = :accountId OR bluePlayer.id = :accountId",
					{
						accountId: query.accountId,
					},
				);
		}

		const [items, total] = await Promise.all([
			matchQb
				.orderBy("match.createdAt", "DESC")
				.take(query.take)
				.skip((query.page - 1) * query.take)
				.getMany(),
			matchQb.getCount(),
		]);

		return { items, total };
	}

	async findOne(id: string, options: FindOneOptions = {}) {
		const hostId = this.cls.get("profile.id");
		const match = await this.matchRepo.findOne({
			where: options.isHost ? { id, hostId } : { id },
			relations: {
				host: true,
				redPlayer: true,
				bluePlayer: true,
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
			this.matchStateRepo.delete({ matchId: id }),
		]);
		this.socketMatchService.emitToMatch(id, SocketEvents.MATCH_DELETED);
	}
}
