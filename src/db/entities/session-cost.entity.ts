import { ColumnNames, TableNames } from "@db/db.constants";
import {
	AfterLoad,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { MatchSessionEntity } from "./match-session.entity";
import { BaseAuditEntity } from "@utils/entities";

@Entity(TableNames.SessionCost)
export class SessionCostEntity extends BaseAuditEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.SessionCost.id })
	id: number;

	@Column({ name: ColumnNames.SessionCost.matchSessionId })
	matchSessionId: number;

	@ManyToOne(() => MatchSessionEntity, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.SessionCost.matchSessionId })
	matchSession: MatchSessionEntity;

	@Column({
		name: ColumnNames.SessionCost.blueTotalCost,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	blueTotalCost: number;

	@Column({
		name: ColumnNames.SessionCost.blueCostMilestone,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	blueCostMilestone: number;

	@Column({
		name: ColumnNames.SessionCost.blueConstellationCost,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	blueConstellationCost: number;

	@Column({
		name: ColumnNames.SessionCost.blueRefinementCost,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	blueRefinementCost: number;

	@Column({
		name: ColumnNames.SessionCost.blueLevelCost,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	blueLevelCost: number;

	@Column({
		name: ColumnNames.SessionCost.blueTimeBonusCost,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	blueTimeBonusCost: number;

	@Column({
		name: ColumnNames.SessionCost.redTotalCost,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	redTotalCost: number;

	@Column({
		name: ColumnNames.SessionCost.redCostMilestone,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	redCostMilestone: number;

	@Column({
		name: ColumnNames.SessionCost.redConstellationCost,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	redConstellationCost: number;

	@Column({
		name: ColumnNames.SessionCost.redRefinementCost,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	redRefinementCost: number;

	@Column({
		name: ColumnNames.SessionCost.redLevelCost,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	redLevelCost: number;

	@Column({
		name: ColumnNames.SessionCost.redTimeBonusCost,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	redTimeBonusCost: number;
}
