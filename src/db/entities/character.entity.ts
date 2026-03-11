import { ColumnNames, IndexNames, TableNames } from "@db/db.constants";
import { CharacterElement, WeaponType } from "@utils/enums";
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
import { CharacterCostEntity } from "./character-cost.entity";
import { AccountCharacterEntity } from "./account-character.entity";

@Entity(TableNames.Character)
export class CharacterEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.Character.id })
	id: number;

	@Column({ name: ColumnNames.Character.key, unique: true })
	key: string;

	@Column({ name: ColumnNames.Character.name })
	name: string;

	@Index(IndexNames.Character.element)
	@Column({ name: ColumnNames.Character.element })
	element: CharacterElement;

	@Index(IndexNames.Character.weaponType)
	@Column({ name: ColumnNames.Character.weaponType })
	weaponType: WeaponType;

	@Column({ name: ColumnNames.Character.iconUrl, nullable: true })
	iconUrl: string;

	@Index(IndexNames.Character.rarity)
	@Column({ name: ColumnNames.Character.rarity })
	rarity: number;

	@Index(IndexNames.Character.isActive)
	@Column({ name: ColumnNames.Global.isActive, default: true })
	isActive: boolean;

	@CreateDateColumn({ name: ColumnNames.Global.createdAt })
	createdAt: Date;

	@Column({ name: ColumnNames.Global.createdById })
	createdById: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Global.createdById })
	createdBy: AccountEntity;

	@UpdateDateColumn({ name: ColumnNames.Global.updatedAt })
	updatedAt: Date;

	@Column({ name: ColumnNames.Global.updatedById, nullable: true })
	updatedById: string;

	@ManyToOne(() => AccountEntity, {
		createForeignKeyConstraints: false,
		nullable: true,
	})
	@JoinColumn({ name: ColumnNames.Global.updatedById })
	updatedBy: AccountEntity;

	@OneToMany(
		() => CharacterCostEntity,
		(characterCost) => characterCost.character,
	)
	characterCosts: CharacterCostEntity[];

	@OneToMany(
		() => AccountCharacterEntity,
		(accountCharacter) => accountCharacter.character,
	)
	accountCharacters: AccountCharacterEntity[];
}
