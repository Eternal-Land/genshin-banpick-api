import { ColumnNames, TableNames } from "@db/db.constants";
import {
	AfterLoad,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity(TableNames.CostMilestone)
export class CostMilestoneEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.CostMilestone.id })
	id: number;

	@Column({
		name: ColumnNames.CostMilestone.costFrom,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	costFrom: number;

	@Column({
		name: ColumnNames.CostMilestone.costTo,
		type: "decimal",
		precision: 7,
		scale: 2,
		nullable: true,
	})
	costTo: number;

	@Column({
		name: ColumnNames.CostMilestone.costValuePerSec,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	costValuePerSec: number;

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

	@AfterLoad()
	afterLoad() {
		this.costFrom = Number(this.costFrom);
		this.costTo = this.costTo !== null ? Number(this.costTo) : null;
		this.costValuePerSec = Number(this.costValuePerSec);
	}
}
