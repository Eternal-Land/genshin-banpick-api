import {
	MatchRepository,
	MatchSessionRepository,
	SessionCostRepository,
	SessionRecordRepository,
} from "@db/repositories";
import { Injectable, NotFoundException } from "@nestjs/common";
import { GenshinBanpickCls } from "@utils";
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

	async save(matchSessionId: number, dto: SaveSessionRecordRequest) {
		const currentAccountId = this.cls.get("profile.id");

		const matchSession = await this.matchSessionRepo.findOne({
			where: { id: matchSessionId, isDeleted: false },
		});

		if (!matchSession) {
			throw new NotFoundException("Match session not found");
		}

		const existedRecord = await this.sessionRecordRepo.findOne({
			where: { matchSessionId, isDeleted: false },
		});

		const payload = {
			matchSessionId,
			blueChamber1: dto.blueChamber1,
			blueChamber2: dto.blueChamber2,
			blueChamber3: dto.blueChamber3,
			blueResetTimes: dto.blueResetTimes,
			blueFinalTime: dto.blueFinalTime,
			redChamber1: dto.redChamber1,
			redChamber2: dto.redChamber2,
			redChamber3: dto.redChamber3,
			redResetTimes: dto.redResetTimes,
			redFinalTime: dto.redFinalTime,
		};

		if (!existedRecord) {
			return await this.sessionRecordRepo.save(
				this.sessionRecordRepo.create({
					...payload,
					createdBy: currentAccountId,
					updatedBy: currentAccountId,
					isDeleted: false,
				}),
			);
		}

		Object.assign(existedRecord, payload);
		existedRecord.updatedBy = currentAccountId;
		existedRecord.isDeleted = false;
		return await this.sessionRecordRepo.save(existedRecord);
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
