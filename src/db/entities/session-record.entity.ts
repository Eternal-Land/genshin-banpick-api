import { ColumnNames, TableNames } from "@db/db.constants";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { MatchSessionEntity } from "./match-session.entity";
import { BaseAuditEntity } from "@utils/entities";

@Entity(TableNames.SessionRecord)
export class SessionRecordEntity extends BaseAuditEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.SessionRecord.id })
	id: number;

	@Column({ name: ColumnNames.SessionRecord.matchSessionId })
	matchSessionId: number;

	@ManyToOne(() => MatchSessionEntity, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.SessionRecord.matchSessionId })
	matchSession: MatchSessionEntity;

	@Column({
		name: ColumnNames.SessionRecord.blueChamber1,
		type: "int",
		default: 0,
	})
	blueChamber1: number;

	@Column({
		name: ColumnNames.SessionRecord.blueChamber2,
		type: "int",
		default: 0,
	})
	blueChamber2: number;

	@Column({
		name: ColumnNames.SessionRecord.blueChamber3,
		type: "int",
		default: 0,
	})
	blueChamber3: number;

	@Column({
		name: ColumnNames.SessionRecord.blueResetTimes,
		type: "int",
		default: 0,
	})
	blueResetTimes: number;

	@Column({
		name: ColumnNames.SessionRecord.blueFinalTime,
		type: "int",
		default: 0,
	})
	blueFinalTime: number;

	@Column({
		name: ColumnNames.SessionRecord.redChamber1,
		type: "int",
		default: 0,
	})
	redChamber1: number;

	@Column({
		name: ColumnNames.SessionRecord.redChamber2,
		type: "int",
		default: 0,
	})
	redChamber2: number;

	@Column({
		name: ColumnNames.SessionRecord.redChamber3,
		type: "int",
		default: 0,
	})
	redChamber3: number;

	@Column({
		name: ColumnNames.SessionRecord.redResetTimes,
		type: "int",
		default: 0,
	})
	redResetTimes: number;

	@Column({
		name: ColumnNames.SessionRecord.redFinalTime,
		type: "int",
		default: 0,
	})
	redFinalTime: number;
}
