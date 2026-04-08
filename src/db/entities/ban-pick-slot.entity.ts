import { ColumnNames, TableNames } from "@db/db.constants";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { MatchSessionEntity } from "./match-session.entity";
import { CharacterEntity } from "./character.entity";
import { WeaponEntity } from "./weapon.entity";
import { AccountEntity } from "./account.entity";

@Entity(TableNames.BanPickSlot)
export class BanPickSlotEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.BanPickSlot.id })
	id: number;

	@Column({ name: ColumnNames.BanPickSlot.matchSessionId })
	matchSessionId: number;

	@ManyToOne(
		() => MatchSessionEntity,
		(matchSession) => matchSession.banPickSlots,
		{
			createForeignKeyConstraints: false,
		},
	)
	@JoinColumn({ name: ColumnNames.BanPickSlot.matchSessionId })
	matchSession: MatchSessionEntity;

	@Column({ name: ColumnNames.BanPickSlot.turnIndex, type: "int" })
	turnIndex: number;

	@Column({ name: ColumnNames.BanPickSlot.teamOrder, type: "int" })
	teamOrder: number;

	@Column({ name: ColumnNames.BanPickSlot.slotType })
	slotType: string;

	@Column({ name: ColumnNames.BanPickSlot.matchSide })
	matchSide: string;

	@Column({ name: ColumnNames.BanPickSlot.slotStatus })
	slotStatus: string;

	@Column({ name: ColumnNames.BanPickSlot.characterId, nullable: true })
	characterId: number;

	@ManyToOne(() => CharacterEntity, {
		createForeignKeyConstraints: false,
		nullable: true,
	})
	@JoinColumn({ name: ColumnNames.BanPickSlot.characterId })
	character: CharacterEntity;

	@Column({ name: ColumnNames.BanPickSlot.weaponId, nullable: true })
	weaponId: number;

	@ManyToOne(() => WeaponEntity, {
		createForeignKeyConstraints: false,
		nullable: true,
	})
	@JoinColumn({ name: ColumnNames.BanPickSlot.weaponId })
	weapon: WeaponEntity;

	@Column({
		name: ColumnNames.BanPickSlot.weaponRefinement,
		type: "int",
		nullable: true,
	})
	weaponRefinement: number;

	@Column({ name: ColumnNames.BanPickSlot.selectedByAccountId, nullable: true })
	selectedByAccountId: string;

	@ManyToOne(() => AccountEntity, {
		createForeignKeyConstraints: false,
		nullable: true,
	})
	@JoinColumn({ name: ColumnNames.BanPickSlot.selectedByAccountId })
	selectedByAccount: AccountEntity;

	@Column({
		name: ColumnNames.BanPickSlot.locketAt,
		type: "datetime",
		nullable: true,
	})
	lockedAt: Date;

	@Column({
		name: ColumnNames.BanPickSlot.weaponSelectedAt,
		type: "datetime",
		nullable: true,
	})
	weaponSelectedAt: Date;
}
