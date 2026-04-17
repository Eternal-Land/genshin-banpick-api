import { SessionCostEntity } from "@db/entities";
import {
	AccountCharacterRepository,
	BanPickSlotRepository,
	CharacterCostRepository,
	CharacterLevelCostRepository,
	CostMilestoneRepository,
	MatchStateRepository,
	MatchSessionRepository,
	SessionCostRepository,
	WeaponCostRepository,
	WeaponRepository,
} from "@db/repositories";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PlayerSide, WeaponCostUnit } from "@utils/enums";
import { SessionCostRequest } from "./dto";
import { IsNull, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { SocketMatchService } from "@modules/socket/services";
import { SocketEvents } from "@utils/constants";

@Injectable()
export class UserSessionCostService {
	private toNumber(value: unknown): number {
		const numeric = Number(value);
		return Number.isFinite(numeric) ? numeric : 0;
	}

	private normalizeSessionCost(sessionCost: SessionCostEntity) {
		sessionCost.blueTotalCost = this.toNumber(sessionCost.blueTotalCost);
		sessionCost.blueCostMilestone = this.toNumber(
			sessionCost.blueCostMilestone,
		);
		sessionCost.blueConstellationCost = this.toNumber(
			sessionCost.blueConstellationCost,
		);
		sessionCost.blueRefinementCost = this.toNumber(
			sessionCost.blueRefinementCost,
		);
		sessionCost.blueLevelCost = this.toNumber(sessionCost.blueLevelCost);
		sessionCost.blueTimeBonusCost = this.toNumber(
			sessionCost.blueTimeBonusCost,
		);
		sessionCost.redTotalCost = this.toNumber(sessionCost.redTotalCost);
		sessionCost.redCostMilestone = this.toNumber(sessionCost.redCostMilestone);
		sessionCost.redConstellationCost = this.toNumber(
			sessionCost.redConstellationCost,
		);
		sessionCost.redRefinementCost = this.toNumber(
			sessionCost.redRefinementCost,
		);
		sessionCost.redLevelCost = this.toNumber(sessionCost.redLevelCost);
		sessionCost.redTimeBonusCost = this.toNumber(sessionCost.redTimeBonusCost);
	}

	private async findOrCreateSessionCost(matchSessionId: number) {
		let sessionCost = await this.sessionCostRepo.findOne({
			where: { matchSessionId },
			order: { id: "DESC" },
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

		this.normalizeSessionCost(sessionCost);
		return sessionCost;
	}

	constructor(
		private readonly matchSessionRepo: MatchSessionRepository,
		private readonly matchStateRepo: MatchStateRepository,
		private readonly banPickSlotRepo: BanPickSlotRepository,
		private readonly characterCostRepo: CharacterCostRepository,
		private readonly accountCharacterRepo: AccountCharacterRepository,
		private readonly weaponRepo: WeaponRepository,
		private readonly weaponCostRepo: WeaponCostRepository,
		private readonly costMilestoneRepo: CostMilestoneRepository,
		private readonly sessionCostRepo: SessionCostRepository,
		private readonly characterLevelCostRepo: CharacterLevelCostRepository,
		private readonly socketMatchService: SocketMatchService,
	) {}

	async getCurrentSessionCost(matchId: string): Promise<SessionCostEntity> {
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

		return await this.findOrCreateSessionCost(currentSession.id);
	}

	async calculate(
		matchSessionId: number,
		dto: SessionCostRequest,
	): Promise<SessionCostEntity> {
		const matchSession = await this.matchSessionRepo.findOne({
			where: { id: matchSessionId, isDeleted: false },
		});

		if (!matchSession) {
			throw new NotFoundException("Match session not found");
		}

		const sessionCost = await this.findOrCreateSessionCost(matchSessionId);

		const slots = await this.banPickSlotRepo.find({
			where: {
				matchSessionId,
				slotStatus: "LOCKED",
			},
			order: { turnIndex: "DESC" },
		});

		const latestSlot = slots[0];
		if (!latestSlot) {
			throw new NotFoundException("Ban pick slot not found for this session");
		}

		if (
			typeof dto.currentTurn === "number" &&
			latestSlot.turnIndex !== dto.currentTurn
		) {
			throw new NotFoundException(
				"Ban pick slot not found for the current turn",
			);
		}

		sessionCost.blueTotalCost = 0;
		sessionCost.blueCostMilestone = 0;
		sessionCost.blueConstellationCost = 0;
		sessionCost.blueRefinementCost = 0;
		sessionCost.blueLevelCost = 0;
		sessionCost.blueTimeBonusCost = 0;
		sessionCost.redTotalCost = 0;
		sessionCost.redCostMilestone = 0;
		sessionCost.redConstellationCost = 0;
		sessionCost.redRefinementCost = 0;
		sessionCost.redLevelCost = 0;
		sessionCost.redTimeBonusCost = 0;

		const characterStateCache = new Map<
			string,
			{ activatedConstellation: number; characterLevel: number } | null
		>();
		const characterCostCache = new Map<string, number>();
		const characterLevelCostCache = new Map<string, number>();
		const weaponRarityCache = new Map<number, number | null>();
		const weaponCostCache = new Map<
			string,
			{ totalCost: number; refinementCost: number }
		>();

		for (const slot of [...slots].reverse()) {
			const slotSide =
				slot.matchSide === "BLUE" ? PlayerSide.BLUE : PlayerSide.RED;

			if (
				slot.slotType === "PICK" &&
				slot.characterId &&
				slot.selectedByAccountId
			) {
				const characterStateKey = `${slot.selectedByAccountId}:${slot.characterId}`;
				let characterState = characterStateCache.get(characterStateKey);
				if (characterState === undefined) {
					const accountCharacter = await this.accountCharacterRepo.findOne({
						where: {
							accountId: slot.selectedByAccountId,
							characterId: slot.characterId,
						},
						select: {
							activatedConstellation: true,
							characterLevel: true,
						},
					});

					characterState = accountCharacter
						? {
								activatedConstellation: accountCharacter.activatedConstellation,
								characterLevel: accountCharacter.characterLevel,
							}
						: null;
					characterStateCache.set(characterStateKey, characterState);
				}

				if (characterState) {
					const characterCostKey = `${slot.characterId}:${characterState.activatedConstellation}`;
					let characterCostValue = characterCostCache.get(characterCostKey);
					if (characterCostValue === undefined) {
						const characterCost = await this.characterCostRepo.findOne({
							where: {
								characterId: slot.characterId,
								constellation: characterState.activatedConstellation,
							},
							select: { cost: true },
						});
						characterCostValue = this.toNumber(characterCost?.cost);
						characterCostCache.set(characterCostKey, characterCostValue);
					}

					if (characterCostValue > 0) {
						if (slotSide === PlayerSide.BLUE) {
							sessionCost.blueConstellationCost += characterCostValue;
							sessionCost.blueTotalCost += characterCostValue;
						} else {
							sessionCost.redConstellationCost += characterCostValue;
							sessionCost.redTotalCost += characterCostValue;
						}
					}

					const levelCostKey = `${slot.characterId}:${characterState.characterLevel}`;
					let characterLevelCostValue =
						characterLevelCostCache.get(levelCostKey);
					if (characterLevelCostValue === undefined) {
						const characterLevelCost =
							await this.characterLevelCostRepo.findOne({
								where: {
									characterId: slot.characterId,
									level: characterState.characterLevel,
								},
								select: { cost: true },
							});
						characterLevelCostValue = this.toNumber(characterLevelCost?.cost);
						characterLevelCostCache.set(levelCostKey, characterLevelCostValue);
					}

					if (characterLevelCostValue > 0) {
						if (slotSide === PlayerSide.BLUE) {
							sessionCost.blueLevelCost += characterLevelCostValue;
						} else {
							sessionCost.redLevelCost += characterLevelCostValue;
						}
					}
				}
			}

			if (
				slot.slotType === "PICK" &&
				slot.weaponId &&
				typeof slot.weaponRefinement === "number" &&
				slot.weaponRefinement > 0
			) {
				let weaponRarity = weaponRarityCache.get(slot.weaponId);
				if (weaponRarity === undefined) {
					const weapon = await this.weaponRepo.findOne({
						where: {
							id: slot.weaponId,
							isActive: true,
						},
						select: { rarity: true },
					});
					weaponRarity = weapon?.rarity ?? null;
					weaponRarityCache.set(slot.weaponId, weaponRarity);
				}

				if (weaponRarity !== null && weaponRarity !== undefined) {
					const weaponCostKey = `${weaponRarity}:${slot.weaponRefinement}`;
					let cachedWeaponCost = weaponCostCache.get(weaponCostKey);
					if (!cachedWeaponCost) {
						const weaponCosts = await this.weaponCostRepo.find({
							where: {
								weaponRarity,
								upgradeLevel: LessThanOrEqual(slot.weaponRefinement),
							},
							select: {
								value: true,
								unit: true,
								upgradeLevel: true,
							},
						});

						const isAllCostUnit =
							weaponCosts.length > 0 &&
							weaponCosts.every(
								(weaponCost) => weaponCost.unit === WeaponCostUnit.COST,
							);

						if (isAllCostUnit) {
							const exactCost = weaponCosts.find(
								(weaponCost) =>
									weaponCost.unit === WeaponCostUnit.COST &&
									weaponCost.upgradeLevel === slot.weaponRefinement,
							);

							cachedWeaponCost = {
								totalCost: this.toNumber(exactCost?.value),
								refinementCost: 0,
							};
						} else {
							cachedWeaponCost = weaponCosts.reduce(
								(acc, weaponCost) => {
									const value = this.toNumber(weaponCost.value);
									if (weaponCost.unit === WeaponCostUnit.SECONDS) {
										acc.refinementCost += value;
									} else {
										acc.totalCost += value;
									}

									return acc;
								},
								{ totalCost: 0, refinementCost: 0 },
							);
						}

						weaponCostCache.set(weaponCostKey, cachedWeaponCost);
					}

					if (slotSide === PlayerSide.BLUE) {
						sessionCost.blueTotalCost += cachedWeaponCost.totalCost;
						sessionCost.blueRefinementCost += cachedWeaponCost.refinementCost;
					} else {
						sessionCost.redTotalCost += cachedWeaponCost.totalCost;
						sessionCost.redRefinementCost += cachedWeaponCost.refinementCost;
					}
				}
			}
		}

		const blueMilestone = await this.costMilestoneRepo.findOne({
			where: [
				{
					costFrom: LessThanOrEqual(sessionCost.blueTotalCost),
					costTo: MoreThanOrEqual(sessionCost.blueTotalCost),
				},
				{
					costFrom: LessThanOrEqual(sessionCost.blueTotalCost),
					costTo: IsNull(),
				},
			],
			order: { costFrom: "DESC" },
		});
		if (blueMilestone) {
			const secPerCost = this.toNumber(blueMilestone.secPerCost);
			sessionCost.blueCostMilestone = blueMilestone.id;
			sessionCost.blueTimeBonusCost =
				this.toNumber(sessionCost.blueTotalCost) * secPerCost +
				sessionCost.blueRefinementCost +
				sessionCost.blueLevelCost;
		}

		const redMilestone = await this.costMilestoneRepo.findOne({
			where: [
				{
					costFrom: LessThanOrEqual(sessionCost.redTotalCost),
					costTo: MoreThanOrEqual(sessionCost.redTotalCost),
				},
				{
					costFrom: LessThanOrEqual(sessionCost.redTotalCost),
					costTo: IsNull(),
				},
			],
			order: { costFrom: "DESC" },
		});
		if (redMilestone) {
			const secPerCost = this.toNumber(redMilestone.secPerCost);
			sessionCost.redCostMilestone = redMilestone.id;
			sessionCost.redTimeBonusCost =
				this.toNumber(sessionCost.redTotalCost) * secPerCost +
				sessionCost.redRefinementCost +
				sessionCost.redLevelCost;
		}

		const savedSessionCost = await this.sessionCostRepo.save(sessionCost);

		this.socketMatchService.emitToMatch(
			matchSession.matchId,
			SocketEvents.UPDATE_MATCH_SESSION,
			{ matchSessionId },
		);

		return savedSessionCost;
	}
}
