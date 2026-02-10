import { ColumnNames, TableNames } from "@db/db.constants";
import { WeaponRarity } from "@utils/enums";
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

@Entity(TableNames.WeaponCostMilestone)
export class WeaponCostMilestoneEntity {
	@PrimaryGeneratedColumn("increment", {
		name: ColumnNames.WeaponCostMilestone.id,
	})
	id: number;

	@Column({ name: ColumnNames.WeaponCostMilestone.weapon_rarity })
	weaponRarity: WeaponRarity;

	@Column({
		name: ColumnNames.WeaponCostMilestone.cost,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	cost: number;

	@Column({
		name: ColumnNames.WeaponCostMilestone.addTime,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	addTime: number;

	@Column({ name: ColumnNames.WeaponCostMilestone.upgradeLevel })
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
		this.cost = Number(this.cost);
		this.addTime = Number(this.addTime);
	}
}
