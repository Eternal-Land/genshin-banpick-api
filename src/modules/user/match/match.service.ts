import {
	AccountCharacterRepository,
	BanPickSlotRepository,
	CharacterCostRepository,
	CharacterRepository,
	MatchRepository,
	MatchSessionRepository,
	MatchStateRepository,
	SessionCostRepository,
	SessionRecordRepository,
	WeaponRepository,
	TeamCostRepository,
} from "@db/repositories";
import {
	MatchEntity,
	SessionCostEntity,
	SessionRecordEntity,
	MatchSessionEntity,
	MatchStateEntity,
} from "@db/entities";
import { BadRequestException, Injectable } from "@nestjs/common";
import { AccountCharacterNotFoundError } from "@modules/account-character/errors";
import { WeaponNotFoundError } from "@modules/admin/weapon/errors";
import { MatchStateResponse } from "@modules/user/match/dto";
import { GenshinBanpickCls } from "@utils";
import {
	MatchSessionStatus,
	MatchStatus,
	MatchType,
	PlayerSide,
} from "@utils/enums";
import { ClsService } from "nestjs-cls";
import { Transactional } from "typeorm-transactional";
import { CreateMatchRequest, MatchQuery } from "./dto";
import {
	MatchAlreadyCompletedError,
	MatchAlreadyStartedError,
	CharacterAlreadyUsedError,
	MatchNotFoundError,
	MatchParticipantMustBeUniqueError,
	NotYourTurnError,
	ParticipantNotFoundError,
	SessionCompletionValidationError,
	WeaponPickRequiresSelectedCharacterError,
} from "./errors";
import { SocketMatchService } from "@modules/socket/services";
import { SocketEvents, THREE_VS_THREE_TIME_REMAIN } from "@utils/constants";
import { Between, In, Not } from "typeorm";
import { UserSessionCostService } from "../session-cost";

interface DraftAction {
	side: PlayerSide;
	type: "ban" | "pick";
}

const RESET_TIME_PENALTY_SECONDS = 10;
const TURN_DURATION_SECONDS = 30;
const THREE_VS_THREE_PICKS_PER_SIDE = 24;
const THREE_VS_THREE_BANS_PER_SIDE = 1;
const CHAMBER_SLOT_COUNT = 8;
const CHAMBER_CONSTELLATION_COST_MULTIPLIER = 5;
const CHAMBER_REFINEMENT_COST_MULTIPLIER = 2;
const CHARACTER_LEVEL_COUNTED_LIST = [
	"mavuika",
	"zibai",
	"flins",
	"mualani",
	"skirk",
	"neuvillette",
	"sandrone",
	"wriothesley",
	"varesa",
	"kinich",
];

const DRAFT_SEQUENCE: DraftAction[] = [
	{ side: PlayerSide.BLUE, type: "ban" },
	{ side: PlayerSide.RED, type: "ban" },
	{ side: PlayerSide.BLUE, type: "ban" },
	{ side: PlayerSide.RED, type: "ban" },
	{ side: PlayerSide.BLUE, type: "pick" },
	{ side: PlayerSide.RED, type: "pick" },
	{ side: PlayerSide.RED, type: "pick" },
	{ side: PlayerSide.BLUE, type: "pick" },
	{ side: PlayerSide.BLUE, type: "pick" },
	{ side: PlayerSide.RED, type: "pick" },
	{ side: PlayerSide.RED, type: "pick" },
	{ side: PlayerSide.BLUE, type: "pick" },
	{ side: PlayerSide.RED, type: "ban" },
	{ side: PlayerSide.BLUE, type: "ban" },
	{ side: PlayerSide.RED, type: "pick" },
	{ side: PlayerSide.BLUE, type: "pick" },
	{ side: PlayerSide.BLUE, type: "pick" },
	{ side: PlayerSide.RED, type: "pick" },
	{ side: PlayerSide.RED, type: "pick" },
	{ side: PlayerSide.BLUE, type: "pick" },
	{ side: PlayerSide.BLUE, type: "pick" },
	{ side: PlayerSide.RED, type: "pick" },
];

/**
 * Creates the 3v3 draft sequence.
 * Pattern: Blue ban, Red ban, then Blue pick 1, Red pick 2,
 * alternating Blue pick 2 and Red pick 2, and ending with Blue pick 1.
 */
const createAlternatingBanPickDraftSequence = (
	bansPerSide: number,
	picksPerSide: number,
): DraftAction[] => {
	const sequence: DraftAction[] = [];

	for (let i = 0; i < bansPerSide; i += 1) {
		sequence.push({ side: PlayerSide.BLUE, type: "ban" });
		sequence.push({ side: PlayerSide.RED, type: "ban" });
	}

	sequence.push({ side: PlayerSide.BLUE, type: "pick" });
	sequence.push({ side: PlayerSide.RED, type: "pick" });
	sequence.push({ side: PlayerSide.RED, type: "pick" });

	const doublePickRounds = (picksPerSide - 2) / 2;
	for (let i = 0; i < doublePickRounds; i += 1) {
		sequence.push({ side: PlayerSide.BLUE, type: "pick" });
		sequence.push({ side: PlayerSide.BLUE, type: "pick" });
		sequence.push({ side: PlayerSide.RED, type: "pick" });
		sequence.push({ side: PlayerSide.RED, type: "pick" });
	}

	sequence.push({ side: PlayerSide.BLUE, type: "pick" });

	return sequence;
};

const THREE_VS_THREE_DRAFT_SEQUENCE = createAlternatingBanPickDraftSequence(
	THREE_VS_THREE_BANS_PER_SIDE,
	THREE_VS_THREE_PICKS_PER_SIDE,
);

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
		private readonly userSessionCostService: UserSessionCostService,
		private readonly matchStateRepo: MatchStateRepository,
		private readonly matchSessionRepo: MatchSessionRepository,
		private readonly banPickSlotRepo: BanPickSlotRepository,
		private readonly accountCharacterRepo: AccountCharacterRepository,
		private readonly characterRepo: CharacterRepository,
		private readonly weaponRepo: WeaponRepository,
		private readonly sessionRecordRepo: SessionRecordRepository,
		private readonly sessionCostRepo: SessionCostRepository,
		private readonly teamCostRepo: TeamCostRepository,
		private readonly characterCostRepo: CharacterCostRepository,
	) {}

	private getDraftSequence(matchType: MatchType) {
		if (matchType === MatchType.THREE_VS_THREE) {
			return THREE_VS_THREE_DRAFT_SEQUENCE;
		}

		return DRAFT_SEQUENCE;
	}

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
		const match = await this.matchRepo.findOne({ where: { id: matchId } });
		if (!match) {
			throw new MatchNotFoundError();
		}

		const existed = await this.matchStateRepo.findOne({
			where: { matchId },
		});

		const existedSessions = await this.matchSessionRepo.find({
			where: { matchId, isDeleted: false },
			select: { id: true },
		});
		const sessionIds = existedSessions.map((session) => session.id);

		if (existed) {
			await this.matchStateRepo.delete({ matchId });
		}

		if (sessionIds.length) {
			await this.banPickSlotRepo.delete({ matchSessionId: In(sessionIds) });
			await this.matchSessionRepo.delete({ matchId });
		}

		const newMatchState = this.matchStateRepo.create({
			matchId,
			blueBanChars: [],
			blueSelectedChars: [],
			blueSelectedWeapons: [],
			redBanChars: [],
			redSelectedChars: [],
			redSelectedWeapons: [],
		});

		if (match.type === MatchType.THREE_VS_THREE) {
			newMatchState.redTimeRemain = THREE_VS_THREE_TIME_REMAIN;
			newMatchState.blueTimeRemain = THREE_VS_THREE_TIME_REMAIN;
		}

		await this.matchStateRepo.insert(newMatchState);

		const sessions = await this.ensureMatchSessions(match);
		const firstSession = sessions[0];
		if (firstSession) {
			await this.matchStateRepo.update(
				{ matchId },
				{ currentSession: firstSession.id },
			);
		}
	}

	private async ensureMatchSessions(match: MatchEntity) {
		const currentAccountId = this.cls.get("profile.id");

		const sessions = await this.matchSessionRepo.find({
			where: { matchId: match.id, isDeleted: false },
			order: { id: "ASC" },
		});

		if (sessions.length >= match.sessionCount) {
			return sessions;
		}

		const sessionsToCreate = Array.from({
			length: match.sessionCount - sessions.length,
		}).map((_, index) => {
			const absoluteIndex = sessions.length + index;
			return {
				matchId: match.id,
				sessionIndex: absoluteIndex + 1,
				blueParticipantId:
					absoluteIndex % 2 === 0 ? match.bluePlayerId : match.redPlayerId,
				redParticipantId:
					absoluteIndex % 2 === 0 ? match.redPlayerId : match.bluePlayerId,
				createdBy: currentAccountId,
				updatedBy: currentAccountId,
				isDeleted: false,
				totalCostBlue: 0,
				totalCostRed: 0,
				sessionStatus:
					absoluteIndex === 0
						? MatchSessionStatus.LIVE
						: MatchSessionStatus.PENDING,
			};
		});

		await this.matchSessionRepo.save(
			this.matchSessionRepo.create(sessionsToCreate),
		);

		return await this.matchSessionRepo.find({
			where: { matchId: match.id, isDeleted: false },
			order: { id: "ASC" },
		});
	}

	private async getCurrentMatchSession(
		match: MatchEntity,
		matchState: MatchStateEntity,
	): Promise<MatchSessionEntity> {
		const sessions = await this.ensureMatchSessions(match);
		const byId = sessions.find(
			(session) => session.id === matchState.currentSession,
		);
		const currentSession = byId ?? sessions[0];
		if (!currentSession) {
			throw new MatchNotFoundError();
		}

		if (matchState.currentSession !== currentSession.id) {
			matchState.currentSession = currentSession.id;
			await this.matchStateRepo.save(matchState);
		}

		return currentSession;
	}

	private mapSlotsToMatchState(
		matchState: MatchStateEntity,
		slots: Array<{
			slotType: string;
			matchSide: string;
			teamOrder: number;
			turnIndex: number;
			characterId: number;
			weaponId: number | null;
			weaponRefinement: number | null;
		}>,
	) {
		const blueBanChars: string[] = [];
		const blueSelectedChars: string[] = [];
		const blueSelectedWeapons: string[] = [];
		const blueSelectedWeaponRefinements: number[] = [];
		const redBanChars: string[] = [];
		const redSelectedChars: string[] = [];
		const redSelectedWeapons: string[] = [];
		const redSelectedWeaponRefinements: number[] = [];

		const banSlots = slots.filter((slot) => slot.slotType === "BAN");
		const pickSlots = slots
			.filter((slot) => slot.slotType === "PICK")
			.sort((left, right) => {
				if (left.matchSide !== right.matchSide) {
					return left.matchSide.localeCompare(right.matchSide);
				}

				if (left.teamOrder !== right.teamOrder) {
					return left.teamOrder - right.teamOrder;
				}

				return left.turnIndex - right.turnIndex;
			});

		banSlots.forEach((slot) => {
			const characterId = String(slot.characterId);
			if (slot.matchSide === "BLUE") {
				blueBanChars.push(characterId);
			} else {
				redBanChars.push(characterId);
			}
		});

		const bannedCharacterIds = new Set([...blueBanChars, ...redBanChars]);

		pickSlots.forEach((slot) => {
			const characterId = String(slot.characterId);
			if (bannedCharacterIds.has(characterId)) {
				return;
			}

			const weaponId = slot.weaponId ? String(slot.weaponId) : "";
			const weaponRefinement =
				typeof slot.weaponRefinement === "number" ? slot.weaponRefinement : 0;

			if (slot.matchSide === "BLUE") {
				blueSelectedChars.push(characterId);
				blueSelectedWeapons.push(weaponId);
				blueSelectedWeaponRefinements.push(weaponRefinement);
			} else {
				redSelectedChars.push(characterId);
				redSelectedWeapons.push(weaponId);
				redSelectedWeaponRefinements.push(weaponRefinement);
			}
		});

		matchState.blueBanChars = blueBanChars;
		matchState.blueSelectedChars = blueSelectedChars;
		matchState.blueSelectedWeapons = blueSelectedWeapons;
		matchState.redBanChars = redBanChars;
		matchState.redSelectedChars = redSelectedChars;
		matchState.redSelectedWeapons = redSelectedWeapons;

		const matchStateWithRefinements = matchState as MatchStateEntity & {
			blueSelectedWeaponRefinements?: number[];
			redSelectedWeaponRefinements?: number[];
		};

		matchStateWithRefinements.blueSelectedWeaponRefinements =
			blueSelectedWeaponRefinements;
		matchStateWithRefinements.redSelectedWeaponRefinements =
			redSelectedWeaponRefinements;
	}

	private async syncMatchStateWithCurrentSession(
		match: MatchEntity,
		matchState: MatchStateEntity,
	) {
		const previousDraftStep = Math.min(
			matchState.blueBanChars.length +
				matchState.blueSelectedChars.length +
				matchState.redBanChars.length +
				matchState.redSelectedChars.length,
			this.getDraftSequence(match.type).length,
		);

		const draftSequence = this.getDraftSequence(match.type);
		const currentSession = await this.getCurrentMatchSession(match, matchState);
		const slots = await this.banPickSlotRepo.find({
			where: {
				matchSessionId: currentSession.id,
				slotStatus: "LOCKED",
			},
			order: { turnIndex: "ASC" },
			select: {
				slotType: true,
				matchSide: true,
				teamOrder: true,
				turnIndex: true,
				characterId: true,
				weaponId: true,
				weaponRefinement: true,
			},
		});

		this.mapSlotsToMatchState(matchState, slots);

		const draftStep = Math.min(
			matchState.blueBanChars.length +
				matchState.blueSelectedChars.length +
				matchState.redBanChars.length +
				matchState.redSelectedChars.length,
			draftSequence.length,
		);
		const hasTurnAdvanced = draftStep > previousDraftStep;

		const nextAction = draftSequence[draftStep];
		if (nextAction && matchState.currentTurn !== nextAction.side) {
			matchState.currentTurn = nextAction.side;
		}

		if (
			match.type === MatchType.THREE_VS_THREE &&
			match.status === MatchStatus.LIVE &&
			nextAction
		) {
			if (!matchState.turnExpiredAt || hasTurnAdvanced) {
				matchState.turnExpiredAt = new Date(
					Date.now() + TURN_DURATION_SECONDS * 1000,
				);
			}
		} else {
			matchState.turnExpiredAt = null;
		}

		return await this.matchStateRepo.save(matchState);
	}

	async findMany(query: MatchQuery) {
		const statusFilter = { status: Not(MatchStatus.CANCELLED) };
		const where = query.accountId
			? [
					{ ...statusFilter, hostId: query.accountId },
					{ ...statusFilter, redPlayerId: query.accountId },
					{ ...statusFilter, bluePlayerId: query.accountId },
				]
			: statusFilter;

		const [items, total] = await this.matchRepo.findAndCount({
			where,
			relations: {
				host: true,
				redPlayer: true,
				bluePlayer: true,
			},
			order: {
				createdAt: "DESC",
			},
			take: query.take,
			skip: (query.page - 1) * query.take,
		});

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
		const sessions = await this.matchSessionRepo.find({
			where: { matchId: id, isDeleted: false },
			select: { id: true },
		});
		const sessionIds = sessions.map((session) => session.id);
		await Promise.all([
			this.matchRepo.delete(id),
			this.matchStateRepo.delete({ matchId: id }),
			sessionIds.length
				? this.banPickSlotRepo.delete({ matchSessionId: In(sessionIds) })
				: Promise.resolve(),
			this.matchSessionRepo.delete({ matchId: id }),
		]);
		this.socketMatchService.emitToMatch(id, SocketEvents.MATCH_DELETED);
	}

	async getMatchState(matchId: string) {
		// check exists
		const match = await this.findOne(matchId);
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}
		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		return await this.syncMatchStateWithCurrentSession(match, matchState);
	}

	async startMatch(matchId: string) {
		const match = await this.findOne(matchId, {
			isHost: true,
			isNotStarted: true,
		});
		await this.matchRepo.update(matchId, { status: MatchStatus.LIVE });
		match.status = MatchStatus.LIVE;
		await this.saveAndBroadcastMatchState(matchId, match);
		this.socketMatchService.emitToMatch(
			matchId,
			SocketEvents.MATCH_STARTED,
			match.type,
		);
	}

	private getPlayerSide(match: MatchEntity, playerId: string) {
		if (playerId === match.bluePlayerId) {
			return PlayerSide.BLUE;
		}

		if (playerId === match.redPlayerId) {
			return PlayerSide.RED;
		}

		return null;
	}

	private async ensureCorrectTurn(
		matchState: MatchStateEntity,
		matchType: MatchType,
		playerSide: PlayerSide,
	) {
		if (matchState.currentTurn !== playerSide) {
			throw new NotYourTurnError();
		}

		if (matchType !== MatchType.THREE_VS_THREE) {
			return;
		}

		if (!matchState.turnExpiredAt) {
			return;
		}

		const turnExpiredAtMs = new Date(matchState.turnExpiredAt).getTime();
		if (!Number.isFinite(turnExpiredAtMs)) {
			return;
		}

		const overtimeSeconds = Math.ceil((Date.now() - turnExpiredAtMs) / 1000);
		if (overtimeSeconds <= 0) {
			return;
		}

		if (playerSide === PlayerSide.BLUE) {
			matchState.blueTimeRemain -= overtimeSeconds;
		} else {
			matchState.redTimeRemain -= overtimeSeconds;
		}

		await this.matchStateRepo.save(matchState);
	}

	private async ensureCharacterNotUsedInSession(
		matchSessionId: number,
		characterId: number,
	) {
		const existed = await this.banPickSlotRepo.exists({
			where: {
				matchSessionId,
				characterId,
				slotStatus: "LOCKED",
			},
		});

		if (existed) {
			throw new CharacterAlreadyUsedError();
		}
	}

	private validateSlotAgainstExpectedDraftAction(
		slot: {
			turnIndex: number;
			slotType: string;
			matchSide: string;
			characterId: number;
			weaponId: number | null;
			weaponRefinement: number | null;
		},
		expectedAction: DraftAction,
		expectedTurnIndex: number,
	) {
		const expectedSlotType = expectedAction.type === "ban" ? "BAN" : "PICK";
		const expectedMatchSide =
			expectedAction.side === PlayerSide.BLUE ? "BLUE" : "RED";

		if (slot.turnIndex !== expectedTurnIndex) {
			throw new SessionCompletionValidationError(
				`Draft turn index mismatch at step ${expectedTurnIndex + 1}`,
			);
		}

		if (
			slot.slotType !== expectedSlotType ||
			slot.matchSide !== expectedMatchSide
		) {
			throw new SessionCompletionValidationError(
				`Draft action mismatch at step ${expectedTurnIndex + 1}`,
			);
		}

		if (!Number.isInteger(slot.characterId) || slot.characterId <= 0) {
			throw new SessionCompletionValidationError(
				`Missing character selection at step ${expectedTurnIndex + 1}`,
			);
		}
	}

	private async ensureSessionDataCompleted(
		matchSessionId: number,
		matchType: MatchType,
	) {
		const draftSequence = this.getDraftSequence(matchType);
		const lockedSlots = await this.banPickSlotRepo.find({
			where: {
				matchSessionId,
				slotStatus: "LOCKED",
			},
			order: { turnIndex: "ASC" },
			select: {
				turnIndex: true,
				slotType: true,
				matchSide: true,
				characterId: true,
				weaponId: true,
				weaponRefinement: true,
			},
		});

		if (lockedSlots.length !== draftSequence.length) {
			throw new SessionCompletionValidationError(
				"Cannot complete session before ban/pick draft is fully completed",
			);
		}

		lockedSlots.forEach((slot, index) => {
			const expectedAction = draftSequence[index];
			if (!expectedAction) {
				throw new SessionCompletionValidationError(
					"Draft contains unexpected extra action",
				);
			}

			this.validateSlotAgainstExpectedDraftAction(slot, expectedAction, index);
		});

		const sessionRecord = await this.sessionRecordRepo.findOne({
			where: {
				matchSessionId,
				isDeleted: false,
			},
			select: {
				blueChamber1: true,
				blueChamber2: true,
				blueChamber3: true,
				blueResetTimes: true,
				blueFinalTime: true,
				redChamber1: true,
				redChamber2: true,
				redChamber3: true,
				redResetTimes: true,
				redFinalTime: true,
			},
		});

		if (!sessionRecord) {
			throw new SessionCompletionValidationError(
				"Cannot complete session before timer record is saved",
			);
		}

		if (matchType === MatchType.REALTIME) {
			if (sessionRecord.blueChamber1 <= 0 || sessionRecord.redChamber1 <= 0) {
				throw new SessionCompletionValidationError(
					"Both Blue and Red chamber 1 time must be greater than 0 for realtime match",
				);
			}

			if (
				sessionRecord.blueChamber2 !== 0 ||
				sessionRecord.blueChamber3 !== 0 ||
				sessionRecord.blueResetTimes !== 0
			) {
				throw new SessionCompletionValidationError(
					"Blue chamber 2, chamber 3, and reset times must be 0 for realtime match",
				);
			}

			if (
				sessionRecord.redChamber2 !== 0 ||
				sessionRecord.redChamber3 !== 0 ||
				sessionRecord.redResetTimes !== 0
			) {
				throw new SessionCompletionValidationError(
					"Red chamber 2, chamber 3, and reset times must be 0 for realtime match",
				);
			}

			if (sessionRecord.blueFinalTime !== sessionRecord.blueChamber1) {
				throw new SessionCompletionValidationError(
					"Blue final time must equal chamber 1 time for realtime match",
				);
			}

			if (sessionRecord.redFinalTime !== sessionRecord.redChamber1) {
				throw new SessionCompletionValidationError(
					"Red final time must equal chamber 1 time for realtime match",
				);
			}
			return;
		}

		if (sessionRecord.blueFinalTime <= 0 || sessionRecord.redFinalTime <= 0) {
			throw new SessionCompletionValidationError(
				"Both Blue and Red final time must be greater than 0",
			);
		}

		const expectedBlueFinalTime =
			sessionRecord.blueChamber1 +
			sessionRecord.blueChamber2 +
			sessionRecord.blueChamber3 +
			sessionRecord.blueResetTimes * RESET_TIME_PENALTY_SECONDS;
		if (sessionRecord.blueFinalTime !== expectedBlueFinalTime) {
			throw new SessionCompletionValidationError(
				"Blue final time must equal the sum of chamber times plus reset penalties",
			);
		}

		const expectedRedFinalTime =
			sessionRecord.redChamber1 +
			sessionRecord.redChamber2 +
			sessionRecord.redChamber3 +
			sessionRecord.redResetTimes * RESET_TIME_PENALTY_SECONDS;
		if (sessionRecord.redFinalTime !== expectedRedFinalTime) {
			throw new SessionCompletionValidationError(
				"Red final time must equal the sum of chamber times plus reset penalties",
			);
		}
	}

	private async saveAndBroadcastMatchState(
		matchId: string,
		match: MatchEntity,
	) {
		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const savedMatchState = await this.syncMatchStateWithCurrentSession(
			match,
			matchState,
		);
		this.socketMatchService.emitToMatch(
			matchId,
			SocketEvents.UPDATE_MATCH_STATE,
			MatchStateResponse.fromEntity(savedMatchState),
		);
		return savedMatchState;
	}

	private normalizePlayerSide(playerSide: PlayerSide) {
		return playerSide === PlayerSide.BLUE ? "BLUE" : "RED";
	}

	private isHost(match: MatchEntity, playerId: string) {
		return match.hostId === playerId;
	}

	private isDraftCompleted(matchState: MatchStateEntity, matchType: MatchType) {
		const totalDraftActions = this.getDraftSequence(matchType).length;
		const completedActions =
			matchState.blueBanChars.length +
			matchState.redBanChars.length +
			matchState.blueSelectedChars.length +
			matchState.redSelectedChars.length;

		return completedActions >= totalDraftActions;
	}

	private async initializeThreeVsThreeTeamCosts(
		match: MatchEntity,
		matchSessionId: number,
		updatedBy: string,
	) {
		let sessionCost = await this.sessionCostRepo.findOne({
			where: { matchSessionId },
		});

		if (!sessionCost) {
			sessionCost = await this.sessionCostRepo.save(
				this.sessionCostRepo.create({
					matchSessionId,
					blueTotalCost: 0,
					blueCostMilestone: 0,
					blueConstellationCost: 0,
					blueRefinementCost: 0,
					blueLevelCost: 0,
					blueTimeBonusCost: 0,
					redTotalCost: 0,
					redCostMilestone: 0,
					redConstellationCost: 0,
					redRefinementCost: 0,
					redLevelCost: 0,
					redTimeBonusCost: 0,
				}),
			);
		}

		for (const teamSide of [PlayerSide.BLUE, PlayerSide.RED]) {
			const defaultAccountId =
				teamSide === PlayerSide.BLUE ? match.bluePlayerId : match.redPlayerId;

			for (let chamberIndex = 1; chamberIndex <= 3; chamberIndex += 1) {
				const existing = await this.teamCostRepo.findOne({
					where: {
						matchSessionId,
						sessionCostId: sessionCost.id,
						teamSide,
						chamberIndex,
					},
				});

				if (!existing) {
					await this.teamCostRepo.save(
						this.teamCostRepo.create({
							matchSessionId,
							sessionCostId: sessionCost.id,
							teamSide,
							chamberIndex,
							accountId: defaultAccountId,
							totalCharacterConstellationCost: 0,
							totalWeaponRefinementCost: 0,
							totalCharacterLevelCost: 0,
							totalChamberTimeBonus: 0,
							isUsedStar: false,
						}),
					);
				}

				await this.recalculateChamberTeamCost(
					match.id,
					matchSessionId,
					teamSide,
					chamberIndex,
					updatedBy,
				);
			}
		}
	}

	private async initializeThreeVsThreeTeamCostsIfDraftCompleted(
		match: MatchEntity,
		matchSessionId: number,
		matchState: MatchStateEntity,
		updatedBy: string,
	) {
		if (match.type !== MatchType.THREE_VS_THREE) {
			return;
		}

		if (!this.isDraftCompleted(matchState, match.type)) {
			return;
		}

		await this.initializeThreeVsThreeTeamCosts(
			match,
			matchSessionId,
			updatedBy,
		);
	}

	private async createBanPickSlot(
		matchSessionId: number,
		playerSide: PlayerSide,
		slotType: "BAN" | "PICK",
		characterId: number,
		selectedByAccountId: string,
	) {
		const normalizedSide = this.normalizePlayerSide(playerSide);
		const [lastSlot, sideSlotsCount] = await Promise.all([
			this.banPickSlotRepo.findOne({
				where: { matchSessionId },
				order: { turnIndex: "DESC" },
				select: { turnIndex: true },
			}),
			this.banPickSlotRepo.count({
				where: {
					matchSessionId,
					matchSide: normalizedSide,
					slotType,
				},
			}),
		]);

		await this.banPickSlotRepo.insert({
			matchSessionId,
			turnIndex: (lastSlot?.turnIndex ?? -1) + 1,
			teamOrder: sideSlotsCount + 1,
			slotType,
			matchSide: normalizedSide,
			slotStatus: "LOCKED",
			characterId,
			selectedByAccountId,
			characterLevel: 90,
			characterConstellation: 0,
			weaponRefinement: 0,
			lockedAt: new Date(),
		});
	}

	private async pickCharByPlayer(
		matchId: string,
		charId: number,
		playerId: string,
	) {
		if (!playerId) {
			throw new MatchNotFoundError();
		}

		const match = await this.findOne(matchId);
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}
		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const matchSession = await this.getCurrentMatchSession(match, matchState);
		const playerSide = this.getPlayerSide(match, playerId);
		if (playerSide === null) {
			throw new MatchNotFoundError();
		}

		await this.ensureCorrectTurn(matchState, match.type, playerSide);

		if (match.type === MatchType.THREE_VS_THREE) {
			const selectedCharacter = await this.characterRepo.findOne({
				where: {
					id: charId,
					isActive: true,
				},
			});

			if (!selectedCharacter) {
				throw new AccountCharacterNotFoundError();
			}
		} else {
			const selectedAccountCharacter = await this.accountCharacterRepo.findOne({
				where: {
					characterId: charId,
					accountId: playerId,
				},
			});

			if (!selectedAccountCharacter) {
				throw new AccountCharacterNotFoundError();
			}
		}

		await this.ensureCharacterNotUsedInSession(matchSession.id, charId);

		await this.createBanPickSlot(
			matchSession.id,
			playerSide,
			"PICK",
			charId,
			playerId,
		);
		const savedMatchState = await this.saveAndBroadcastMatchState(
			matchId,
			match,
		);
		await this.initializeThreeVsThreeTeamCostsIfDraftCompleted(
			match,
			matchSession.id,
			savedMatchState,
			playerId,
		);
	}

	@Transactional()
	async pickChar(matchId: string, charId: number) {
		const playerId = this.cls.get("profile.id");
		await this.pickCharByPlayer(matchId, charId, playerId);
	}

	@Transactional()
	async banCharFromSocket(matchId: string, charId: number, playerId: string) {
		if (!playerId) {
			throw new MatchNotFoundError();
		}

		const match = await this.findOne(matchId);
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}
		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const matchSession = await this.getCurrentMatchSession(match, matchState);
		const playerSide = this.getPlayerSide(match, playerId);
		if (playerSide === null) {
			throw new MatchNotFoundError();
		}

		await this.ensureCorrectTurn(matchState, match.type, playerSide);
		await this.ensureCharacterNotUsedInSession(matchSession.id, charId);

		await this.createBanPickSlot(
			matchSession.id,
			playerSide,
			"BAN",
			charId,
			playerId,
		);
		const savedMatchState = await this.saveAndBroadcastMatchState(
			matchId,
			match,
		);
		await this.initializeThreeVsThreeTeamCostsIfDraftCompleted(
			match,
			matchSession.id,
			savedMatchState,
			playerId,
		);
	}

	@Transactional()
	async pickCharFromSocket(matchId: string, charId: number, playerId: string) {
		await this.pickCharByPlayer(matchId, charId, playerId);
	}

	@Transactional()
	async undoLastBanPickTurnFromSocket(matchId: string, playerId: string) {
		const match = await this.findOne(matchId);
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}

		if (!this.isHost(match, playerId)) {
			throw new BadRequestException("Only host can undo previous turn");
		}

		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const matchSession = await this.getCurrentMatchSession(match, matchState);

		const lastLockedSlot = await this.banPickSlotRepo.findOne({
			where: {
				matchSessionId: matchSession.id,
				slotStatus: "LOCKED",
			},
			order: { turnIndex: "DESC" },
			select: { id: true },
		});

		if (!lastLockedSlot) {
			return;
		}

		await this.banPickSlotRepo.delete({ id: lastLockedSlot.id });
		await this.saveAndBroadcastMatchState(matchId, match);
	}

	@Transactional()
	async swapBanPickSlotTeamOrderFromSocket(
		matchId: string,
		side: "blue" | "red",
		sourceTeamOrder: number,
		targetTeamOrder: number,
		playerId: string,
	) {
		const match = await this.findOne(matchId);
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}

		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const matchSession = await this.getCurrentMatchSession(match, matchState);
		const playerSide = this.getPlayerSide(match, playerId);
		if (playerSide === null) {
			throw new MatchNotFoundError();
		}

		const normalizedPayloadSide =
			side === "blue" ? PlayerSide.BLUE : PlayerSide.RED;
		const isHost = this.isHost(match, playerId);
		if (!isHost && playerSide !== normalizedPayloadSide) {
			throw new BadRequestException("Cannot reorder the opponent side slots");
		}

		if (sourceTeamOrder === targetTeamOrder) {
			return;
		}

		const normalizedSide = this.normalizePlayerSide(normalizedPayloadSide);
		const slotsToSwap = await this.banPickSlotRepo.find({
			where: {
				matchSessionId: matchSession.id,
				matchSide: normalizedSide,
				slotType: "PICK",
				slotStatus: "LOCKED",
				teamOrder: In([sourceTeamOrder, targetTeamOrder]),
			},
			select: {
				id: true,
				teamOrder: true,
				weaponRefinement: true,
			},
		});

		if (slotsToSwap.length !== 2) {
			throw new BadRequestException("Invalid team order swap payload");
		}

		console.log("Slots to swap:", slotsToSwap);

		const sourceSlot = slotsToSwap.find(
			(slot) => slot.teamOrder === sourceTeamOrder,
		);
		const targetSlot = slotsToSwap.find(
			(slot) => slot.teamOrder === targetTeamOrder,
		);

		if (!sourceSlot || !targetSlot) {
			throw new BadRequestException("Invalid team order swap payload");
		}

		sourceSlot.teamOrder = targetTeamOrder;
		targetSlot.teamOrder = sourceTeamOrder;

		await this.banPickSlotRepo.save([sourceSlot, targetSlot]);

		for (let chamberIndex = 1; chamberIndex <= 3; chamberIndex += 1) {
			await this.recalculateChamberTeamCost(
				matchId,
				matchSession.id,
				normalizedPayloadSide,
				chamberIndex,
				playerId,
			);
		}

		await this.saveAndBroadcastMatchState(matchId, match);
	}

	@Transactional()
	async banChar(matchId: string, charId: number) {
		const playerId = this.cls.get("profile.id");
		const match = await this.findOne(matchId);
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}
		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const matchSession = await this.getCurrentMatchSession(match, matchState);
		const playerSide = this.getPlayerSide(match, playerId);
		if (playerSide === null) {
			throw new MatchNotFoundError();
		}

		await this.ensureCorrectTurn(matchState, match.type, playerSide);

		await this.ensureCharacterNotUsedInSession(matchSession.id, charId);

		await this.createBanPickSlot(
			matchSession.id,
			playerSide,
			"BAN",
			charId,
			playerId,
		);
		const savedMatchState = await this.saveAndBroadcastMatchState(
			matchId,
			match,
		);
		await this.initializeThreeVsThreeTeamCostsIfDraftCompleted(
			match,
			matchSession.id,
			savedMatchState,
			playerId,
		);
	}

	@Transactional()
	async pickWeapon(
		matchId: string,
		charId: number,
		weaponId: string,
		weaponRefinement: number,
	) {
		const playerId = this.cls.get("profile.id");
		const match = await this.findOne(matchId);
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}
		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const matchSession = await this.getCurrentMatchSession(match, matchState);
		const playerSide = this.getPlayerSide(match, playerId);
		if (playerSide === null) {
			throw new MatchNotFoundError();
		}

		const normalizedWeaponId = Number(weaponId);
		if (!Number.isInteger(normalizedWeaponId)) {
			throw new WeaponNotFoundError();
		}

		const normalizedWeaponRefinement = Number(weaponRefinement);
		if (!Number.isInteger(normalizedWeaponRefinement)) {
			throw new BadRequestException("Invalid weapon refinement");
		}

		const isUnequip = normalizedWeaponId <= 0;
		if (isUnequip) {
			if (normalizedWeaponRefinement !== 0) {
				throw new BadRequestException("Invalid weapon refinement");
			}
		} else if (
			normalizedWeaponRefinement < 1 ||
			normalizedWeaponRefinement > 5
		) {
			throw new BadRequestException("Invalid weapon refinement");
		}

		if (!isUnequip) {
			const weapon = await this.weaponRepo.findOne({
				where: {
					id: normalizedWeaponId,
					isActive: true,
				},
			});

			if (!weapon) {
				throw new WeaponNotFoundError();
			}
		}

		const normalizedSide = this.normalizePlayerSide(playerSide);
		const sidePickSlots = await this.banPickSlotRepo.find({
			where: {
				matchSessionId: matchSession.id,
				matchSide: normalizedSide,
				slotType: "PICK",
				slotStatus: "LOCKED",
			},
			order: { teamOrder: "ASC" },
		});

		if (!sidePickSlots.length) {
			throw new WeaponPickRequiresSelectedCharacterError();
		}

		const selectedPickSlot = sidePickSlots.find(
			(slot) => slot.characterId === charId,
		);
		if (!selectedPickSlot) {
			throw new AccountCharacterNotFoundError();
		}

		if (isUnequip) {
			selectedPickSlot.weaponId = null;
			selectedPickSlot.weaponRefinement = null;
			selectedPickSlot.weaponSelectedAt = null;
		} else {
			selectedPickSlot.weaponId = normalizedWeaponId;
			selectedPickSlot.weaponRefinement = normalizedWeaponRefinement;
			selectedPickSlot.weaponSelectedAt = new Date();
		}
		await this.banPickSlotRepo.save(selectedPickSlot);

		try {
			await this.userSessionCostService.calculate(matchSession.id, {
				side: playerSide,
			});
		} catch {
			// Keep weapon selection successful even if cost recalculation fails.
		}

		const savedMatchState = await this.saveAndBroadcastMatchState(
			matchId,
			match,
		);
		this.socketMatchService.emitToMatch(
			matchId,
			SocketEvents.UPDATE_MATCH_SESSION,
			{ matchSessionId: savedMatchState.currentSession },
		);
	}

	@Transactional()
	async updateSlotBuild(
		matchId: string,
		teamOrder: number,
		characterId: number,
		characterConstellation: number,
		weaponRefinement: number,
		characterLevel: number,
	) {
		const playerId = this.cls.get("profile.id");
		await this.updateSlotBuildByPlayer(
			matchId,
			teamOrder,
			characterId,
			characterConstellation,
			weaponRefinement,
			characterLevel,
			playerId,
		);
	}

	@Transactional()
	async updateSlotBuildFromSocket(
		matchId: string,
		side: "blue" | "red",
		teamOrder: number,
		characterId: number,
		characterConstellation: number,
		weaponRefinement: number,
		characterLevel: number,
		playerId: string,
	) {
		await this.updateSlotBuildByPlayer(
			matchId,
			teamOrder,
			characterId,
			characterConstellation,
			weaponRefinement,
			characterLevel,
			playerId,
			side,
		);
	}

	@Transactional()
	async updateTeamCostFromSocket(
		matchId: string,
		teamSide: "blue" | "red",
		chamberIndex: number,
		accountId: string,
		isUsedStar: boolean,
		playerId: string,
	) {
		const match = await this.findOne(matchId);
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}

		if (chamberIndex < 1 || chamberIndex > 3) {
			throw new BadRequestException("Invalid chamber index");
		}

		const expectedSide =
			teamSide === "blue" ? match.bluePlayerId : match.redPlayerId;
		const isHost = this.isHost(match, playerId);
		if (expectedSide !== playerId && !isHost) {
			throw new BadRequestException(
				"Cannot update. You are not host or side owner",
			);
		}

		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const matchSession = await this.getCurrentMatchSession(match, matchState);
		const sessionCost = await this.sessionCostRepo.findOne({
			where: { matchSessionId: matchSession.id },
		});

		if (!sessionCost) {
			throw new BadRequestException("Session cost not found");
		}

		const normalizedSide =
			teamSide === "blue" ? PlayerSide.BLUE : PlayerSide.RED;
		const teamCost = await this.teamCostRepo.findOne({
			where: {
				matchSessionId: matchSession.id,
				sessionCostId: sessionCost.id,
				teamSide: normalizedSide,
				chamberIndex,
			},
		});

		const savedTeamCost =
			teamCost ??
			this.teamCostRepo.create({
				matchSessionId: matchSession.id,
				sessionCostId: sessionCost.id,
				teamSide: normalizedSide,
				chamberIndex,
				accountId,
				totalCharacterConstellationCost: 0,
				totalWeaponRefinementCost: 0,
				totalCharacterLevelCost: 0,
				totalChamberTimeBonus: 0,
				isUsedStar,
			});

		if (teamCost) {
			teamCost.accountId = accountId;
			teamCost.isUsedStar = isUsedStar;
		}

		await this.teamCostRepo.save(savedTeamCost);

		await this.recalculateChamberTeamCost(
			matchId,
			matchSession.id,
			normalizedSide,
			chamberIndex,
			playerId,
		);
	}

	private async updateSlotBuildByPlayer(
		matchId: string,
		teamOrder: number,
		characterId: number,
		characterConstellation: number,
		weaponRefinement: number,
		characterLevel: number,
		playerId: string,
		side?: "blue" | "red",
	) {
		const match = await this.findOne(matchId);
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}

		if (teamOrder <= 0) {
			throw new BadRequestException("Invalid team order");
		}

		if (
			characterConstellation < 0 ||
			weaponRefinement < 0 ||
			characterLevel < 0
		) {
			throw new BadRequestException("Invalid slot build values");
		}

		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const matchSession = await this.getCurrentMatchSession(match, matchState);
		const playerSide = this.getPlayerSide(match, playerId);
		if (playerSide === null) {
			throw new MatchNotFoundError();
		}

		let targetSide = playerSide;

		if (side) {
			const normalizedPayloadSide =
				side === "blue" ? PlayerSide.BLUE : PlayerSide.RED;
			const isHost = this.isHost(match, playerId);
			if (!isHost && playerSide !== normalizedPayloadSide) {
				throw new BadRequestException(
					"Cannot update. You are not host or side owner",
				);
			}

			targetSide = normalizedPayloadSide;
		}

		const normalizedSide = this.normalizePlayerSide(targetSide);
		const slot = await this.banPickSlotRepo.findOne({
			where: {
				matchSessionId: matchSession.id,
				matchSide: normalizedSide,
				slotType: "PICK",
				slotStatus: "LOCKED",
				teamOrder,
			},
		});

		if (!slot || slot.characterId !== characterId) {
			throw new BadRequestException("Invalid slot build target");
		}

		slot.characterConstellation = characterConstellation;
		slot.weaponRefinement = weaponRefinement;
		slot.characterLevel = characterLevel;
		await this.banPickSlotRepo.save(slot);

		const chamberIndex = Math.min(3, Math.ceil(teamOrder / CHAMBER_SLOT_COUNT));
		await this.recalculateChamberTeamCost(
			matchId,
			matchSession.id,
			targetSide,
			chamberIndex,
			playerId,
		);
	}

	private getCharacterLevelTimeCost(level: number) {
		if (level === 95) {
			return 1;
		}

		if (level === 100) {
			return 2;
		}

		return 0;
	}

	private calculatePunishTime(remainTimeSec: number) {
		if (remainTimeSec >= 0) {
			return 0;
		}

		return Math.floor(-remainTimeSec / 20) * 5;
	}

	private async syncSessionTimeBonusWithTeamCost(
		matchId: string,
		matchSessionId: number,
		sessionCost: SessionCostEntity,
	) {
		const [teamCosts, matchState] = await Promise.all([
			this.teamCostRepo.find({
				where: {
					matchSessionId,
					sessionCostId: sessionCost.id,
					isDeleted: false,
				},
				select: {
					teamSide: true,
					totalChamberTimeBonus: true,
				},
			}),
			this.matchStateRepo.findOne({ where: { matchId } }),
		]);

		let blueTeamBonus = 0;
		let redTeamBonus = 0;

		for (const teamCost of teamCosts) {
			const bonusValue = Number(teamCost.totalChamberTimeBonus ?? 0);
			if (teamCost.teamSide === PlayerSide.BLUE) {
				blueTeamBonus += bonusValue;
			} else if (teamCost.teamSide === PlayerSide.RED) {
				redTeamBonus += bonusValue;
			}
		}

		const blueRemainTime = Number(matchState?.blueTimeRemain ?? 0);
		const redRemainTime = Number(matchState?.redTimeRemain ?? 0);

		sessionCost.blueTimeBonusCost =
			blueTeamBonus + this.calculatePunishTime(blueRemainTime);
		sessionCost.redTimeBonusCost =
			redTeamBonus + this.calculatePunishTime(redRemainTime);

		await this.sessionCostRepo.save(sessionCost);

		this.socketMatchService.emitToMatch(
			matchId,
			SocketEvents.UPDATE_MATCH_SESSION,
			{ matchSessionId },
		);
	}

	private async recalculateChamberTeamCost(
		matchId: string,
		matchSessionId: number,
		teamSide: PlayerSide,
		chamberIndex: number,
		updatedBy: string,
	) {
		const sessionCost = await this.sessionCostRepo.findOne({
			where: { matchSessionId },
		});
		if (!sessionCost) {
			return;
		}

		const teamCost = await this.teamCostRepo.findOne({
			where: {
				matchSessionId,
				sessionCostId: sessionCost.id,
				teamSide,
				chamberIndex,
			},
		});
		if (!teamCost) {
			return;
		}

		const matchSide = this.normalizePlayerSide(teamSide);
		const startTeamOrder = (chamberIndex - 1) * CHAMBER_SLOT_COUNT + 1;
		const endTeamOrder = chamberIndex * CHAMBER_SLOT_COUNT;
		const slots = await this.banPickSlotRepo.find({
			where: {
				matchSessionId,
				matchSide,
				slotType: "PICK",
				slotStatus: "LOCKED",
				teamOrder: Between(startTeamOrder, endTeamOrder),
			},
		});

		const characterCostCache = new Map<string, number>();
		let totalConstellationCost = 0;
		let totalRefinementCost = 0;
		let totalLevelCost = 0;

		for (const slot of slots) {
			if (slot.weaponRefinement === 0.5) {
				totalConstellationCost += 0.5;
			}

			if (slot.weaponRefinement >= 1) {
				totalRefinementCost += slot.weaponRefinement - 1;
				totalConstellationCost += 1;
			}

			const currentSlotCharacter = await this.characterRepo.findOne({
				where: { id: slot.characterId },
			});
			if (
				CHARACTER_LEVEL_COUNTED_LIST.includes(
					currentSlotCharacter.key.toString().toLowerCase(),
				)
			) {
				totalLevelCost += this.getCharacterLevelTimeCost(
					slot.characterLevel ?? 0,
				);
			}

			if (!slot.characterId) {
				continue;
			}

			const constellation = slot.characterConstellation ?? 0;
			const cacheKey = `${slot.characterId}:${constellation}`;
			let characterCostValue = characterCostCache.get(cacheKey);
			if (characterCostValue === undefined) {
				const characterCost = await this.characterCostRepo.findOne({
					where: { characterId: slot.characterId, constellation },
					select: { cost: true },
				});
				characterCostValue = Number(characterCost?.cost) || 0;
				characterCostCache.set(cacheKey, characterCostValue);
			}

			totalConstellationCost += characterCostValue;
		}

		teamCost.totalCharacterConstellationCost = totalConstellationCost;
		teamCost.totalWeaponRefinementCost = totalRefinementCost;
		teamCost.totalCharacterLevelCost = totalLevelCost;
		teamCost.totalChamberTimeBonus =
			totalConstellationCost * CHAMBER_CONSTELLATION_COST_MULTIPLIER +
			totalRefinementCost * CHAMBER_REFINEMENT_COST_MULTIPLIER +
			totalLevelCost;

		await this.teamCostRepo.save(teamCost);
		await this.syncSessionTimeBonusWithTeamCost(
			matchId,
			matchSessionId,
			sessionCost,
		);

		this.socketMatchService.emitToMatch(
			matchId,
			SocketEvents.UPDATE_TEAM_COST,
			{
				teamSide: teamSide === PlayerSide.BLUE ? "blue" : "red",
				chamberIndex,
				accountId: teamCost.accountId,
				isUsedStar: teamCost.isUsedStar,
				totalCharacterConstellationCost:
					teamCost.totalCharacterConstellationCost,
				totalWeaponRefinementCost: teamCost.totalWeaponRefinementCost,
				totalCharacterLevelCost: teamCost.totalCharacterLevelCost,
				totalChamberTimeBonus: teamCost.totalChamberTimeBonus,
				updatedBy,
			},
		);
	}

	@Transactional()
	async completeCurrentSession(matchId: string) {
		const match = await this.findOne(matchId, { isHost: true });
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}

		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const currentSession = await this.getCurrentMatchSession(match, matchState);

		await this.ensureSessionDataCompleted(currentSession.id, match.type);

		if (match.type === MatchType.THREE_VS_THREE) {
			await this.initializeThreeVsThreeTeamCosts(
				match,
				currentSession.id,
				this.cls.get("profile.id"),
			);
		}

		const currentSessionCost = await this.sessionCostRepo.findOne({
			where: { matchSessionId: currentSession.id },
		});

		// Mark current session completed
		currentSession.totalCostBlue = Number(
			currentSessionCost?.blueTotalCost ?? 0,
		);
		currentSession.totalCostRed = Number(currentSessionCost?.redTotalCost ?? 0);
		currentSession.sessionStatus = MatchSessionStatus.COMPLETED;
		currentSession.startedAt = matchState.startedAt;
		await this.matchSessionRepo.save(currentSession);

		// Fetch all sessions and records to determine wins
		const sessions = await this.matchSessionRepo.find({
			where: { matchId, isDeleted: false },
			order: { sessionIndex: "ASC", id: "ASC" },
		});

		const sessionIds = sessions.map((s) => s.id);
		const records = sessionIds.length
			? await this.sessionRecordRepo.find({
					where: { matchSessionId: In(sessionIds), isDeleted: false },
				})
			: [];
		const costs = sessionIds.length
			? await this.sessionCostRepo.find({
					where: { matchSessionId: In(sessionIds) },
				})
			: [];

		let blueWins = 0;
		let redWins = 0;

		const completedSessions = sessions.filter(
			(s) => s.sessionStatus === MatchSessionStatus.COMPLETED,
		);

		for (const session of completedSessions) {
			const record = records.find((r) => r.matchSessionId === session.id);
			const cost = costs.find((c) => c.matchSessionId === session.id);

			const blueTotalTime = this.calculateSessionResultTotal(
				record,
				cost,
				PlayerSide.BLUE,
			);

			const redTotalTime = this.calculateSessionResultTotal(
				record,
				cost,
				PlayerSide.RED,
			);

			if (blueTotalTime < redTotalTime) {
				// Blue participant of THIS session won
				// Note: The UI shows match.bluePlayer as the overall Blue player.
				// In odd sessions, blueParticipant == bluePlayer. In even, redParticipant == bluePlayer.
				if (session.blueParticipantId === match.bluePlayerId) {
					blueWins++;
				} else {
					redWins++;
				}
			} else if (redTotalTime < blueTotalTime) {
				if (session.redParticipantId === match.redPlayerId) {
					redWins++;
				} else {
					blueWins++;
				}
			}
		}

		const winsRequired = Math.ceil(match.sessionCount / 2);

		if (
			blueWins >= winsRequired ||
			redWins >= winsRequired ||
			completedSessions.length >= match.sessionCount
		) {
			await this.matchRepo.update(matchId, { status: MatchStatus.COMPLETED });
		} else {
			// Find next pending session
			const nextSession = sessions.find(
				(s) => s.sessionStatus === MatchSessionStatus.PENDING,
			);
			if (nextSession) {
				nextSession.sessionStatus = MatchSessionStatus.LIVE;
				await this.matchSessionRepo.save(nextSession);

				// Re-assign matchState to new session, empty out slots
				await this.matchStateRepo.update(
					{ matchId },
					{
						currentSession: nextSession.id,
						currentTurn: PlayerSide.BLUE,
						turnExpiredAt: null,
						blueBanChars: [],
						blueSelectedChars: [],
						blueSelectedWeapons: [],
						redBanChars: [],
						redSelectedChars: [],
						redSelectedWeapons: [],
					},
				);

				// Swap blue and red player for side "Đổi bên" UI effect
				await this.matchRepo.update(matchId, {
					bluePlayerId: match.redPlayerId,
					redPlayerId: match.bluePlayerId,
				});
			} else {
				// Defensive terminal guard: if there is no pending session left,
				// this match must be treated as finished instead of remaining LIVE.
				await this.matchRepo.update(matchId, {
					status: MatchStatus.COMPLETED,
				});
			}
		}

		const updatedMatch = await this.findOne(matchId);
		await this.saveAndBroadcastMatchState(matchId, updatedMatch);
		this.socketMatchService.emitToMatch(matchId, SocketEvents.MATCH_UPDATED, {
			...updatedMatch,
		});
	}

	private calculateSessionResultTotal(
		record: SessionRecordEntity | undefined,
		cost: SessionCostEntity | undefined,
		side: PlayerSide,
	) {
		if (side === PlayerSide.BLUE) {
			return (
				(record ? Number(cost?.blueTimeBonusCost ?? 0) : 0) +
				Math.max(0, Number(record?.blueChamber1 ?? 0)) +
				Math.max(0, Number(record?.blueChamber2 ?? 0)) +
				Math.max(0, Number(record?.blueChamber3 ?? 0))
			);
		}

		return (
			(record ? Number(cost?.redTimeBonusCost ?? 0) : 0) +
			Math.max(0, Number(record?.redChamber1 ?? 0)) +
			Math.max(0, Number(record?.redChamber2 ?? 0)) +
			Math.max(0, Number(record?.redChamber3 ?? 0))
		);
	}
}
