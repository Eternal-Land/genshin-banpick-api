import { ColumnNames, TableNames } from "@db/db.constants";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { MatchEntity } from "./match.entity";
import { AccountEntity } from "./account.entity";

@Entity(TableNames.MatchSession)
export class MatchSessionEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.MatchSession.id })
	id: number;

	@Column({ name: ColumnNames.Match.id })
	matchId: string;

	@ManyToOne(() => MatchEntity, (match) => match.sessions, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.Match.id })
	match: MatchEntity;

	@Column({ name: ColumnNames.MatchSession.redParticipantId })
	redParticipantId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.MatchSession.redParticipantId })
	redParticipant: AccountEntity;

	@Column({ name: ColumnNames.MatchSession.blueParticipantId })
	blueParticipantId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.MatchSession.blueParticipantId })
	blueParticipant: AccountEntity;
}
