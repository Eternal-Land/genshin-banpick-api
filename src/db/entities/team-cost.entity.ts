import {
	AfterLoad,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { ColumnNames, TableNames } from "@db/db.constants";
import { MatchSessionEntity } from "./match-session.entity";
import { SessionCostEntity } from "./session-cost.entity";
import { PlayerSide } from "@utils/enums";
import { AccountEntity } from "./account.entity";
import { BaseAuditEntity } from "@utils/entities";

@Entity(TableNames.TeamCost)
export class TeamCostEntity extends BaseAuditEntity {
	@PrimaryGeneratedColumn("increment", {
		name: ColumnNames.TeamCost.id,
	})
	id: number;

	@Column({ name: ColumnNames.TeamCost.matchSessionId })
	matchSessionId: number;

	@ManyToOne(() => MatchSessionEntity, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.TeamCost.matchSessionId })
	matchSession: MatchSessionEntity;

	@Column({ name: ColumnNames.TeamCost.sessionCostId })
	sessionCostId: number;

	@ManyToOne(() => SessionCostEntity, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.TeamCost.sessionCostId })
	sessionCost: SessionCostEntity;

	@Column({ name: ColumnNames.TeamCost.teamSide })
	teamSide: PlayerSide;

	@Column({ name: ColumnNames.TeamCost.chamberIndex, type: "int" })
	chamberIndex: number;

	@Column({ name: ColumnNames.TeamCost.accountId })
	accountId: string;

	@ManyToOne(() => AccountEntity, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.TeamCost.accountId })
	account: AccountEntity;

	@Column({
		name: ColumnNames.TeamCost.totalCharacterConstellationCost,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	totalCharacterConstellationCost: number;

	@Column({ name: ColumnNames.TeamCost.totalWeaponRefinementCost, type: "int" })
	totalWeaponRefinementCost: number;

	@Column({ name: ColumnNames.TeamCost.totalCharacterLevelCost, type: "int" })
	totalCharacterLevelCost: number;

	@Column({
		name: ColumnNames.TeamCost.totalChamberTimeBonus,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	totalChamberTimeBonus: number;

	@Column({
		name: ColumnNames.TeamCost.isUsedStar,
		type: "boolean",
		default: false,
	})
	isUsedStar: boolean;

	@AfterLoad()
	afterLoad() {
		this.totalCharacterConstellationCost = Number(
			this.totalCharacterConstellationCost,
		);
		this.totalWeaponRefinementCost = Number(this.totalWeaponRefinementCost);
		this.totalCharacterLevelCost = Number(this.totalCharacterLevelCost);
		this.totalChamberTimeBonus = Number(this.totalChamberTimeBonus);
	}
}
