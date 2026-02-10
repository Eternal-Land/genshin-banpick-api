import { ColumnNames, TableNames } from "@db/db.constants";
import {
	AfterLoad,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { WeaponEntity } from "./weapon.entity";

@Entity(TableNames.WeaponCost)
export class WeaponCostEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.WeaponCost.id })
	id: number;

	@Column({
		name: ColumnNames.WeaponCost.cost,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	cost: number;

	@Column({
		name: ColumnNames.WeaponCost.addTime,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	addTime: number;

	@Column({ name: ColumnNames.WeaponCost.upgradeLevel })
	upgradeLevel: number;

	@Column({ name: ColumnNames.Weapon.id })
	weaponId: number;

	@ManyToOne(() => WeaponEntity, (weapon) => weapon.weaponCosts, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.Weapon.id })
	weapon: WeaponEntity;

	@AfterLoad()
	afterLoad() {
		this.cost = Number(this.cost);
		this.addTime = Number(this.addTime);
	}
}
