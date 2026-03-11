import { ColumnNames, IndexNames, TableNames } from "@db/db.constants";
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
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

	@Index(IndexNames.Match.hostId)
	@Column({ name: ColumnNames.Match.hostId })
	hostId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Match.hostId })
	host: AccountEntity;

	@Column({ name: ColumnNames.Match.type, default: MatchType.REALTIME })
	type: MatchType;

	@Index(IndexNames.Match.createdAt)
	@CreateDateColumn({ name: ColumnNames.Global.createdAt })
	createdAt: Date;

	@Column({ name: ColumnNames.Match.sessionCount, default: 1 })
	sessionCount: number;

	@OneToMany(() => MatchSessionEntity, (session) => session.match)
	sessions: MatchSessionEntity[];

	@Column({ name: ColumnNames.Match.status, default: MatchStatus.WAITING })
	status: MatchStatus;

	@Index(IndexNames.Match.redPlayerId)
	@Column({ name: ColumnNames.Match.redPlayerId, nullable: true })
	redPlayerId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Match.redPlayerId })
	redPlayer: AccountEntity;

	@Index(IndexNames.Match.bluePlayerId)
	@Column({ name: ColumnNames.Match.bluePlayerId, nullable: true })
	bluePlayerId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Match.bluePlayerId })
	bluePlayer: AccountEntity;
}
