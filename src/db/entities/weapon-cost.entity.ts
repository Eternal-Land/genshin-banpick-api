import { ColumnNames, TableNames } from "@db/db.constants";
import { WeaponCostUnit, WeaponRarity } from "@utils/enums";
import {
	AfterLoad,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity(TableNames.WeaponCost)
export class WeaponCostEntity {
	@PrimaryGeneratedColumn("increment", {
		name: ColumnNames.WeaponCost.id,
	})
	id: number;

	@Column({ name: ColumnNames.WeaponCost.weaponRarity })
	weaponRarity: WeaponRarity;

	@Column({
		name: ColumnNames.WeaponCost.value,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	value: number;

	@Column({ name: ColumnNames.WeaponCost.unit })
	unit: WeaponCostUnit;

	@Column({ name: ColumnNames.WeaponCost.upgradeLevel })
	upgradeLevel: number;

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

	@AfterLoad()
	afterLoad() {
		this.value = Number(this.value);
	}
}
