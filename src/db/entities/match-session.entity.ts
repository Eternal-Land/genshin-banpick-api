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

@Entity(TableNames.MatchSession)
export class MatchSessionEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.MatchSession.id })
	id: number;

	@Index(IndexNames.MatchSession.matchId)
	@Column({ name: ColumnNames.Match.id })
	matchId: string;

	@ManyToOne(() => MatchEntity, (match) => match.sessions, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.Match.id })
	match: MatchEntity;

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

	@Column({ name: ColumnNames.MatchSession.sessionStatus, default: "PENDING" })
	sessionStatus: string;

	@OneToMany(() => BanPickSlotEntity, (banPickSlot) => banPickSlot.matchSession)
	banPickSlots: BanPickSlotEntity[];
}
