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

@Entity(TableNames.MatchInvitation)
export class MatchInvitationEntity {
	@PrimaryGeneratedColumn("uuid", { name: ColumnNames.MatchInvitation.id })
	id: string;

	@Column({ name: ColumnNames.Account.id })
	accountId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Account.id })
	account: AccountEntity;

	@Column({ name: ColumnNames.Match.id })
	matchId: string;

	@ManyToOne(() => MatchEntity, (match) => match.invitations, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.Match.id })
	match: MatchEntity;
}
