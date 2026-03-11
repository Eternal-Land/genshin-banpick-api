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
	UpdateDateColumn,
} from "typeorm";
import { AccountEntity } from "./account.entity";
import { CharacterEntity } from "./character.entity";

@Entity(TableNames.AccountCharacter)
@Index(
	IndexNames.AccountCharacter.accountIdCharacterId,
	["accountId", "characterId"],
	{ unique: true },
)
export class AccountCharacterEntity {
	@PrimaryGeneratedColumn("uuid", { name: ColumnNames.AccountCharacter.id })
	id: string;

	@Column({ name: ColumnNames.AccountCharacter.accountId })
	accountId: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.AccountCharacter.accountId })
	account: AccountEntity;

	@Index(IndexNames.AccountCharacter.characterId)
	@Column({ name: ColumnNames.AccountCharacter.characterId, type: "int" })
	characterId: number;

	@ManyToOne(() => CharacterEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.AccountCharacter.characterId })
	character: CharacterEntity;

	@Column({
		name: ColumnNames.AccountCharacter.activatedConstellation,
		type: "int",
		default: 0,
	})
	activatedConstellation: number;

	@Column({
		name: ColumnNames.AccountCharacter.characterLevel,
		type: "int",
		default: 0,
	})
	characterLevel: number;

	@Column({ name: ColumnNames.AccountCharacter.isOwned, default: true })
	isOwned: boolean;

	@Column({
		name: ColumnNames.AccountCharacter.notes,
		type: "varchar",
		nullable: true,
	})
	notes: string;

	@CreateDateColumn({ name: ColumnNames.Global.createdAt })
	createdAt: Date;

	@UpdateDateColumn({ name: ColumnNames.Global.updatedAt })
	updatedAt: Date;
}
