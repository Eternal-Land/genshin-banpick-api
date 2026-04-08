import { ColumnNames, IndexNames, TableNames } from "@db/db.constants";
import {
	AfterLoad,
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { AccountEntity } from "./account.entity";
import { CharacterEntity } from "./character.entity";

@Entity(TableNames.CharacterLevelCost)
@Index(
	IndexNames.CharacterLevelCost.characterIdLevel,
	["characterId", "level"],
	{
		unique: true,
	},
)
export class CharacterLevelCostEntity {
	@PrimaryGeneratedColumn("increment", {
		name: ColumnNames.CharacterLevelCost.id,
	})
	id: number;

	@Column({ name: ColumnNames.CharacterLevelCost.characterId, type: "int" })
	characterId: number;

	@ManyToOne(() => CharacterEntity, { createForeignKeyConstraints: false })
	@JoinColumn({ name: ColumnNames.CharacterLevelCost.characterId })
	character: CharacterEntity;

	@Column({ name: ColumnNames.CharacterLevelCost.level })
	level: number;

	@Column({
		name: ColumnNames.CharacterLevelCost.cost,
		type: "decimal",
		precision: 7,
		scale: 2,
	})
	cost: number;

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
	}
}
