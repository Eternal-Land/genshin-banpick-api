import { ColumnNames, TableNames } from "@db/db.constants";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { AccountEntity } from "./account.entity";
import { MatchSessionEntity } from "./match-session.entity";
import { MatchParticipantEntity } from "./match-participant.entity";

@Entity(TableNames.Match)
export class MatchEntity {
	@PrimaryGeneratedColumn("uuid", { name: ColumnNames.Match.id })
	id: string;

	@Column({ name: ColumnNames.Match.hostId })
	hostId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Match.hostId })
	host: AccountEntity;

	@Column({ name: ColumnNames.Match.name, default: "New Match" })
	name: string;

	@CreateDateColumn({ name: ColumnNames.Global.createdAt })
	createdAt: Date;

	@Column({ name: ColumnNames.Match.sessionCount, default: 1 })
	sessionCount: number;

	@OneToMany(() => MatchSessionEntity, (session) => session.match)
	sessions: MatchSessionEntity[];

	@OneToMany(() => MatchParticipantEntity, (participant) => participant.match)
	participants: MatchParticipantEntity[];
}
