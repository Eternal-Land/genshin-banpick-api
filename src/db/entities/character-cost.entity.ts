import { ColumnNames, TableNames } from "@db/db.constants";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
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

	@ManyToOne(() => CharacterEntity, (character) => character.characterCosts, {
		createForeignKeyConstraints: false,
	})
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
