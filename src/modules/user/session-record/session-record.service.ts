import {
	MatchRepository,
	MatchSessionRepository,
	SessionCostRepository,
	SessionRecordRepository,
} from "@db/repositories";
import { MatchSessionEntity, SessionRecordEntity } from "@db/entities";
import { Injectable, NotFoundException } from "@nestjs/common";
import { GenshinBanpickCls } from "@utils";
import { MatchType } from "@utils/enums";
import { ClsService } from "nestjs-cls";
import { In } from "typeorm";
import { SaveSessionRecordRequest } from "./dto";

@Injectable()
export class UserSessionRecordService {
	constructor(
		private readonly matchRepo: MatchRepository,
		private readonly matchSessionRepo: MatchSessionRepository,
		private readonly sessionRecordRepo: SessionRecordRepository,
		private readonly sessionCostRepo: SessionCostRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
	) {}

	async save(
		matchSessionId: number,
		dto: SaveSessionRecordRequest,
		accountId?: string,
	) {
		const currentAccountId = accountId ?? this.cls.get("profile.id");

		return await this.sessionRecordRepo.manager.transaction(async (manager) => {
			const matchSession = await manager
				.getRepository(MatchSessionEntity)
				.createQueryBuilder("matchSession")
				.leftJoinAndSelect("matchSession.match", "match")
				.setLock("pessimistic_write")
				.where("matchSession.id = :matchSessionId", { matchSessionId })
				.andWhere("matchSession.isDeleted = :isDeleted", {
					isDeleted: false,
				})
				.getOne();

			if (!matchSession) {
				throw new NotFoundException("Match session not found");
			}

			const sessionRecordRepo = manager.getRepository(SessionRecordEntity);
			const existedRecords = await sessionRecordRepo.find({
				where: { matchSessionId, isDeleted: false },
				order: { updatedAt: "DESC", id: "DESC" },
			});

			const toChamberTotal = (value: number) => {
				const normalized = Number.isFinite(value)
					? Math.max(0, Math.floor(value))
					: 0;
				return Math.max(0, 600 - normalized);
			};

			const isRealtimeMatch = matchSession.match?.type === MatchType.REALTIME;

			const blueChamber1 = toChamberTotal(dto.blueChamber1);
			const blueChamber2 = isRealtimeMatch
				? 0
				: toChamberTotal(dto.blueChamber2);
			const blueChamber3 = isRealtimeMatch
				? 0
				: toChamberTotal(dto.blueChamber3);

			const redChamber1 = toChamberTotal(dto.redChamber1);
			const redChamber2 = isRealtimeMatch ? 0 : toChamberTotal(dto.redChamber2);
			const redChamber3 = isRealtimeMatch ? 0 : toChamberTotal(dto.redChamber3);

			const payload = {
				matchSessionId,
				blueChamber1,
				blueChamber2,
				blueChamber3,
				blueResetTimes: dto.blueResetTimes,
				blueFinalTime: blueChamber1 + blueChamber2 + blueChamber3,
				redChamber1,
				redChamber2,
				redChamber3,
				redResetTimes: dto.redResetTimes,
				redFinalTime: redChamber1 + redChamber2 + redChamber3,
			};

			const primaryRecord = existedRecords[0];
			const duplicateRecords = existedRecords.slice(1);

			if (!primaryRecord) {
				return await sessionRecordRepo.save(
					sessionRecordRepo.create({
						...payload,
						createdBy: currentAccountId,
						updatedBy: currentAccountId,
						isDeleted: false,
					}),
				);
			}

			Object.assign(primaryRecord, payload);
			primaryRecord.updatedBy = currentAccountId;
			primaryRecord.isDeleted = false;

			if (duplicateRecords.length > 0) {
				for (const duplicateRecord of duplicateRecords) {
					duplicateRecord.isDeleted = true;
					duplicateRecord.updatedBy = currentAccountId;
				}
				await sessionRecordRepo.save(duplicateRecords);
			}

			return await sessionRecordRepo.save(primaryRecord);
		});
	}

	async getMatchReport(matchId: string) {
		const match = await this.matchRepo.findOne({
			where: { id: matchId },
			relations: {
				host: true,
				redPlayer: true,
				bluePlayer: true,
			},
		});

		if (!match) {
			throw new NotFoundException("Match not found");
		}

		const sessions = await this.matchSessionRepo.find({
			where: { matchId, isDeleted: false },
			relations: {
				blueParticipant: true,
				redParticipant: true,
			},
			order: {
				sessionIndex: "ASC",
				id: "ASC",
			},
		});

		const sessionIds = sessions.map((session) => session.id);
		const records = sessionIds.length
			? await this.sessionRecordRepo.find({
					where: { matchSessionId: In(sessionIds), isDeleted: false },
				})
			: [];

		const recordsBySessionId = new Map(
			records.map((record) => [record.matchSessionId, record] as const),
		);

		const costs = sessionIds.length
			? await this.sessionCostRepo.find({
					where: { matchSessionId: In(sessionIds) },
				})
			: [];

		const costsBySessionId = new Map(
			costs.map((cost) => [cost.matchSessionId, cost] as const),
		);

		return {
			match,
			sessions,
			recordsBySessionId,
			costsBySessionId,
		};
	}
}
