import {
	AccountCharacterRepository,
	BanPickSlotRepository,
	MatchRepository,
	MatchSessionRepository,
	MatchStateRepository,
	SessionCostRepository,
	SessionRecordRepository,
	WeaponRepository,
} from "@db/repositories";
import {
	MatchEntity,
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
import { SocketEvents } from "@utils/constants";
import { In, Not } from "typeorm";

interface DraftAction {
	side: PlayerSide;
	type: "ban" | "pick";
}

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
		private readonly matchSessionRepo: MatchSessionRepository,
		private readonly banPickSlotRepo: BanPickSlotRepository,
		private readonly accountCharacterRepo: AccountCharacterRepository,
		private readonly weaponRepo: WeaponRepository,
		private readonly sessionRecordRepo: SessionRecordRepository,
		private readonly sessionCostRepo: SessionCostRepository,
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

		await this.matchStateRepo.insert({
			matchId,
			blueBanChars: [],
			blueSelectedChars: [],
			blueSelectedWeapons: [],
			redBanChars: [],
			redSelectedChars: [],
			redSelectedWeapons: [],
		});

		const match = await this.matchRepo.findOne({ where: { id: matchId } });
		if (!match) {
			throw new MatchNotFoundError();
		}
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

		slots.forEach((slot) => {
			const characterId = String(slot.characterId);
			const weaponId = slot.weaponId ? String(slot.weaponId) : "";
			const weaponRefinement =
				typeof slot.weaponRefinement === "number" ? slot.weaponRefinement : 0;

			if (slot.slotType === "BAN") {
				if (slot.matchSide === "BLUE") {
					blueBanChars.push(characterId);
				} else {
					redBanChars.push(characterId);
				}
				return;
			}

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
			DRAFT_SEQUENCE.length,
		);

		const nextAction = DRAFT_SEQUENCE[draftStep];
		if (nextAction && matchState.currentTurn !== nextAction.side) {
			matchState.currentTurn = nextAction.side;
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
		await this.findOne(matchId, { isHost: true, isNotStarted: true });
		await this.matchRepo.update(matchId, { status: MatchStatus.LIVE });
		this.socketMatchService.emitToMatch(matchId, SocketEvents.MATCH_STARTED);
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

	private ensureCorrectTurn(
		matchState: MatchStateEntity,
		playerSide: PlayerSide,
	) {
		if (matchState.currentTurn !== playerSide) {
			throw new NotYourTurnError();
		}
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

		if (lockedSlots.length !== DRAFT_SEQUENCE.length) {
			throw new SessionCompletionValidationError(
				"Cannot complete session before ban/pick draft is fully completed",
			);
		}

		lockedSlots.forEach((slot, index) => {
			const expectedAction = DRAFT_SEQUENCE[index];
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
			sessionRecord.blueChamber3;
		if (sessionRecord.blueFinalTime !== expectedBlueFinalTime) {
			throw new SessionCompletionValidationError(
				"Blue final time must equal the sum of chamber times",
			);
		}

		const expectedRedFinalTime =
			sessionRecord.redChamber1 +
			sessionRecord.redChamber2 +
			sessionRecord.redChamber3;
		if (sessionRecord.redFinalTime !== expectedRedFinalTime) {
			throw new SessionCompletionValidationError(
				"Red final time must equal the sum of chamber times",
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
			lockedAt: new Date(),
		});
	}

	@Transactional()
	async pickChar(matchId: string, charId: number) {
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

		this.ensureCorrectTurn(matchState, playerSide);

		const selectedAccountCharacter = await this.accountCharacterRepo.findOne({
			where: {
				characterId: charId,
				accountId: playerId,
			},
		});

		if (!selectedAccountCharacter) {
			throw new AccountCharacterNotFoundError();
		}

		await this.ensureCharacterNotUsedInSession(matchSession.id, charId);

		await this.createBanPickSlot(
			matchSession.id,
			playerSide,
			"PICK",
			charId,
			playerId,
		);
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

		this.ensureCorrectTurn(matchState, playerSide);

		await this.ensureCharacterNotUsedInSession(matchSession.id, charId);

		await this.createBanPickSlot(
			matchSession.id,
			playerSide,
			"BAN",
			charId,
			playerId,
		);
		await this.saveAndBroadcastMatchState(matchId, match);
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
		if (!Number.isInteger(normalizedWeaponId) || normalizedWeaponId <= 0) {
			throw new WeaponNotFoundError();
		}

		const normalizedWeaponRefinement = Number(weaponRefinement);
		if (
			!Number.isInteger(normalizedWeaponRefinement) ||
			normalizedWeaponRefinement < 1 ||
			normalizedWeaponRefinement > 5
		) {
			throw new BadRequestException("Invalid weapon refinement");
		}

		const weapon = await this.weaponRepo.findOne({
			where: {
				id: normalizedWeaponId,
				isActive: true,
			},
		});

		if (!weapon) {
			throw new WeaponNotFoundError();
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

		selectedPickSlot.weaponId = normalizedWeaponId;
		selectedPickSlot.weaponRefinement = normalizedWeaponRefinement;
		selectedPickSlot.weaponSelectedAt = new Date();
		await this.banPickSlotRepo.save(selectedPickSlot);

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
	async completeCurrentSession(matchId: string) {
		const hostId = this.cls.get("profile.id");
		const match = await this.findOne(matchId, { isHost: true });
		if ([MatchStatus.COMPLETED, MatchStatus.CANCELLED].includes(match.status)) {
			throw new MatchAlreadyCompletedError();
		}

		const matchState = await this.matchStateRepo.findOneOrCreate(matchId);
		const currentSession = await this.getCurrentMatchSession(match, matchState);

		await this.ensureSessionDataCompleted(currentSession.id, match.type);

		// Mark current session completed
		currentSession.sessionStatus = MatchSessionStatus.COMPLETED;
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

			const blueFinalTime = record ? Number(record.blueFinalTime) : 0;
			const blueTimeBonus = cost ? Number(cost.blueTimeBonusCost) : 0;
			// 0 penalty per reset
			const blueTotalTime = blueFinalTime + blueTimeBonus;

			const redFinalTime = record ? Number(record.redFinalTime) : 0;
			const redTimeBonus = cost ? Number(cost.redTimeBonusCost) : 0;
			const redTotalTime = redFinalTime + redTimeBonus;

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
}
