import { ColumnNames, TableNames } from "@db/db.constants";
import { WeaponRarity, WeaponType } from "@utils/enums";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity(TableNames.Weapon)
export class WeaponEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.Weapon.id })
	id: number;

	@Column({ name: ColumnNames.Weapon.key, unique: true })
	key: string;

	@Column({ name: ColumnNames.Weapon.name })
	name: string;

	@Column({ name: ColumnNames.Weapon.type })
	type: WeaponType;

	@Column({ name: ColumnNames.Weapon.rarity })
	rarity: WeaponRarity;

	@Column({ name: ColumnNames.Weapon.iconUrl, nullable: true })
	iconUrl: string;

	@Column({ name: ColumnNames.Global.isActive, default: true })
	isActive: boolean;

	@CreateDateColumn({ name: ColumnNames.Global.createdAt })
	createdAt: Date;

	@Column({ name: ColumnNames.Global.createdById })
	createdById: string;

	@ManyToOne(() => AccountEntity, { createForeignKeyConstraints: true })
	@JoinColumn({ name: ColumnNames.Global.createdById })
	createdBy: AccountEntity;

	@UpdateDateColumn({ name: ColumnNames.Global.updatedAt, nullable: true })
	updatedAt: Date;

	@Column({ name: ColumnNames.Global.updatedById, nullable: true })
	updatedById: string;

	@ManyToOne(() => AccountEntity, {
		createForeignKeyConstraints: true,
		nullable: true,
	})
	@JoinColumn({ name: ColumnNames.Global.updatedById })
	updatedBy: AccountEntity;
}
