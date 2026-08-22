import { BanPickSlotEntity, SessionRecordEntity } from "@db/entities";
import { TeamCostEntity } from "@db/entities/team-cost.entity";
import { ApiProperty } from "@nestjs/swagger";
import { PlayerSide } from "@utils/enums";
import { Builder } from "builder-pattern";

class SessionStateBanPickSlotResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	matchSessionId: number;

	@ApiProperty()
	teamOrder: number;

	@ApiProperty()
	slotType: string;

	@ApiProperty()
	matchSide: string;

	@ApiProperty({ nullable: true })
	characterId: number | null;

	@ApiProperty({ nullable: true })
	weaponId: number | null;

	@ApiProperty({ nullable: true })
	weaponRefinement: number | null;

	@ApiProperty({ nullable: true })
	characterConstellation: number | null;

	@ApiProperty({ nullable: true })
	characterLevel: number | null;

	static fromEntity(
		entity: BanPickSlotEntity,
	): SessionStateBanPickSlotResponse {
		return Builder(SessionStateBanPickSlotResponse)
			.id(entity.id)
			.matchSessionId(entity.matchSessionId)
			.teamOrder(entity.teamOrder)
			.slotType(entity.slotType)
			.matchSide(entity.matchSide)
			.characterId(entity.characterId ?? null)
			.weaponId(entity.weaponId ?? null)
			.weaponRefinement(entity.weaponRefinement ?? null)
			.characterConstellation(entity.characterConstellation ?? null)
			.characterLevel(entity.characterLevel ?? null)
			.build();
	}
}

class SessionStateTeamCostResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	matchSessionId: number;

	@ApiProperty()
	sessionCostId: number;

	@ApiProperty({ enum: PlayerSide })
	teamSide: PlayerSide;

	@ApiProperty()
	chamberIndex: number;

	@ApiProperty()
	accountId: string;

	@ApiProperty()
	totalCharacterConstellationCost: number;

	@ApiProperty()
	totalWeaponRefinementCost: number;

	@ApiProperty()
	totalCharacterLevelCost: number;

	@ApiProperty()
	totalChamberTimeBonus: number;

	@ApiProperty()
	isUsedStar: boolean;

	static fromEntity(entity: TeamCostEntity): SessionStateTeamCostResponse {
		return Builder(SessionStateTeamCostResponse)
			.id(entity.id)
			.matchSessionId(entity.matchSessionId)
			.sessionCostId(entity.sessionCostId)
			.teamSide(entity.teamSide)
			.chamberIndex(entity.chamberIndex)
			.accountId(entity.accountId)
			.totalCharacterConstellationCost(entity.totalCharacterConstellationCost)
			.totalWeaponRefinementCost(entity.totalWeaponRefinementCost)
			.totalCharacterLevelCost(entity.totalCharacterLevelCost)
			.totalChamberTimeBonus(entity.totalChamberTimeBonus)
			.isUsedStar(entity.isUsedStar)
			.build();
	}
}

class SessionStateRecordResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	matchSessionId: number;

	@ApiProperty()
	blueChamber1: number;

	@ApiProperty()
	blueChamber2: number;

	@ApiProperty()
	blueChamber3: number;

	@ApiProperty()
	blueResetTimes: number;

	@ApiProperty()
	blueFinalTime: number;

	@ApiProperty()
	redChamber1: number;

	@ApiProperty()
	redChamber2: number;

	@ApiProperty()
	redChamber3: number;

	@ApiProperty()
	redResetTimes: number;

	@ApiProperty()
	redFinalTime: number;

	static fromEntity(entity: SessionRecordEntity): SessionStateRecordResponse {
		return Builder(SessionStateRecordResponse)
			.id(entity.id)
			.matchSessionId(entity.matchSessionId)
			.blueChamber1(entity.blueChamber1)
			.blueChamber2(entity.blueChamber2)
			.blueChamber3(entity.blueChamber3)
			.blueResetTimes(entity.blueResetTimes)
			.blueFinalTime(entity.blueFinalTime)
			.redChamber1(entity.redChamber1)
			.redChamber2(entity.redChamber2)
			.redChamber3(entity.redChamber3)
			.redResetTimes(entity.redResetTimes)
			.redFinalTime(entity.redFinalTime)
			.build();
	}
}

export class SessionStateResponse {
	@ApiProperty()
	matchSessionId: number;

	@ApiProperty({ type: SessionStateBanPickSlotResponse, isArray: true })
	banPickSlots: SessionStateBanPickSlotResponse[];

	@ApiProperty({ type: SessionStateTeamCostResponse, isArray: true })
	teamCosts: SessionStateTeamCostResponse[];

	@ApiProperty({ type: SessionStateRecordResponse, nullable: true })
	sessionRecord: SessionStateRecordResponse | null;

	static fromEntity(
		matchSessionId: number,
		banPickSlots: BanPickSlotEntity[],
		teamCosts: TeamCostEntity[],
		sessionRecord: SessionRecordEntity | null,
	): SessionStateResponse {
		return Builder(SessionStateResponse)
			.matchSessionId(matchSessionId)
			.banPickSlots(
				banPickSlots.map((slot) =>
					SessionStateBanPickSlotResponse.fromEntity(slot),
				),
			)
			.teamCosts(
				teamCosts.map((item) => SessionStateTeamCostResponse.fromEntity(item)),
			)
			.sessionRecord(
				sessionRecord
					? SessionStateRecordResponse.fromEntity(sessionRecord)
					: null,
			)
			.build();
	}
}
