import { ColumnNames, TableNames } from "@db/db.constants";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	UpdateDateColumn,
	AfterLoad,
} from "typeorm";
import { CharacterEntity } from "./character.entity";
import { AccountEntity } from "./account.entity";

@Entity(TableNames.CharacterCost)
export class CharacterCostEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.CharacterCost.id })
	id: number;

	@Column({ name: ColumnNames.Character.id })
	characterId: number;

	@ManyToOne(() => CharacterEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.Character.id })
	character: CharacterEntity;

	@Column({ name: ColumnNames.CharacterCost.constellation })
	constellation: number;

	@Column({
		name: ColumnNames.CharacterCost.cost,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	cost: number;

	@Column({ name: ColumnNames.Global.isActive, default: true })
	isActive: boolean;

	@UpdateDateColumn()
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
	}
}
