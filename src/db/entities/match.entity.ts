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
import { MatchStatus, MatchType } from "@utils/enums";

@Entity(TableNames.Match)
export class MatchEntity {
	@PrimaryGeneratedColumn("uuid", { name: ColumnNames.Match.id })
	id: string;

	@Column({ name: ColumnNames.Match.hostId })
	hostId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Match.hostId })
	host: AccountEntity;

	@Column({ name: ColumnNames.Match.type, default: MatchType.REALTIME })
	type: MatchType;

	@CreateDateColumn({ name: ColumnNames.Global.createdAt })
	createdAt: Date;

	@Column({ name: ColumnNames.Match.sessionCount, default: 1 })
	sessionCount: number;

	@OneToMany(() => MatchSessionEntity, (session) => session.match)
	sessions: MatchSessionEntity[];

	@Column({ name: ColumnNames.Match.status, default: MatchStatus.WAITING })
	status: MatchStatus;

	@Column({ name: ColumnNames.Match.redPlayerId, nullable: true })
	redPlayerId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Match.redPlayerId })
	redPlayer: AccountEntity;

	@Column({ name: ColumnNames.Match.bluePlayerId, nullable: true })
	bluePlayerId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Match.bluePlayerId })
	bluePlayer: AccountEntity;
}
