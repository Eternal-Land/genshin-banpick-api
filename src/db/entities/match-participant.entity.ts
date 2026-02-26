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

@Entity(TableNames.MatchParticipant)
export class MatchParticipantEntity {
	@PrimaryGeneratedColumn("increment", {
		name: ColumnNames.MatchParticipant.id,
	})
	id: number;

	@Column({ name: ColumnNames.Match.id })
	matchId: string;

	@ManyToOne(() => MatchEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Match.id })
	match: MatchEntity;

	@Column({ name: ColumnNames.MatchParticipant.participantId })
	participantId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.MatchParticipant.participantId })
	participant: AccountEntity;
}
