import { ColumnNames, IndexNames, TableNames } from "@db/db.constants";
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { MatchEntity } from "./match.entity";
import { BanPickSlotEntity } from "./ban-pick-slot.entity";
import { AccountEntity } from "./account.entity";
import { PlayerSide } from "@utils/enums";
import { MatchSessionStatus } from "@utils/enums";
import { BaseAuditEntity } from "@utils/entities";

@Entity(TableNames.MatchSession)
export class MatchSessionEntity extends BaseAuditEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.MatchSession.id })
	id: number;

	@Column({
		name: ColumnNames.MatchSession.sessionIndex,
		type: "int",
		default: 1,
	})
	sessionIndex: number;

	@Index(IndexNames.MatchSession.matchId)
	@Column({ name: ColumnNames.Match.id })
	matchId: string;

	@ManyToOne(() => MatchEntity, (match) => match.sessions, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.Match.id })
	match: MatchEntity;

	@Index(IndexNames.MatchSession.redParticipantId)
	@Column({ name: ColumnNames.MatchSession.redParticipantId, nullable: true })
	redParticipantId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.MatchSession.redParticipantId })
	redParticipant: AccountEntity;

	@Index(IndexNames.MatchSession.blueParticipantId)
	@Column({ name: ColumnNames.MatchSession.blueParticipantId, nullable: true })
	blueParticipantId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.MatchSession.blueParticipantId })
	blueParticipant: AccountEntity;

	@Column({
		name: ColumnNames.MatchSession.currentTurn,
		type: "int",
		default: PlayerSide.BLUE,
	})
	currentTurn: PlayerSide;

	@Column({
		name: ColumnNames.MatchSession.totalCostBlue,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	totalCostBlue: number;

	@Column({
		name: ColumnNames.MatchSession.totalCostRed,
		type: "decimal",
		precision: 7,
		scale: 2,
		default: 0,
	})
	totalCostRed: number;

	@Column({
		name: ColumnNames.MatchSession.sessionStatus,
		default: MatchSessionStatus.PENDING,
	})
	sessionStatus: MatchSessionStatus;

	@OneToMany(() => BanPickSlotEntity, (banPickSlot) => banPickSlot.matchSession)
	banPickSlots: BanPickSlotEntity[];
}
