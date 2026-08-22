import {
	BanPickSlotRepository,
	MatchStateRepository,
	MatchSessionRepository,
	SessionRecordRepository,
	TeamCostRepository,
} from "@db/repositories";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class UserSessionStateService {
	constructor(
		private readonly matchSessionRepo: MatchSessionRepository,
		private readonly matchStateRepo: MatchStateRepository,
		private readonly banPickSlotRepo: BanPickSlotRepository,
		private readonly teamCostRepo: TeamCostRepository,
		private readonly sessionRecordRepo: SessionRecordRepository,
	) {}

	async getCurrentSessionState(matchId: string) {
		const sessions = await this.matchSessionRepo.find({
			where: { matchId, isDeleted: false },
			order: { id: "ASC" },
		});

		if (!sessions.length) {
			throw new NotFoundException("Match session not found");
		}

		const matchState = await this.matchStateRepo.findOne({
			where: { matchId },
		});
		const currentSession =
			sessions.find((session) => session.id === matchState?.currentSession) ??
			sessions[0];

		const [banPickSlots, teamCosts, sessionRecord] = await Promise.all([
			this.banPickSlotRepo.find({
				where: {
					matchSessionId: currentSession.id,
					slotType: "PICK",
					slotStatus: "LOCKED",
				},
				order: {
					matchSide: "ASC",
					teamOrder: "ASC",
				},
			}),
			this.teamCostRepo.find({
				where: { matchSessionId: currentSession.id },
				order: {
					teamSide: "ASC",
					chamberIndex: "ASC",
					id: "ASC",
				},
			}),
			this.sessionRecordRepo.findOne({
				where: {
					matchSessionId: currentSession.id,
					isDeleted: false,
				},
				order: {
					updatedAt: "DESC",
					id: "DESC",
				},
			}),
		]);

		return {
			matchSessionId: currentSession.id,
			banPickSlots,
			teamCosts,
			sessionRecord,
		};
	}
}
