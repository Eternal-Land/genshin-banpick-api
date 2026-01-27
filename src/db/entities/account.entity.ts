import { ColumnNames, TableNames } from "@db/db.constants";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { AccountRole } from "@utils/enums";
import { StaffRoleEntity } from "./staff-role.entity";

@Entity(TableNames.Account)
export class AccountEntity {
	@PrimaryGeneratedColumn("uuid", { name: ColumnNames.Account.id })
	id: string;

	@Column({ name: ColumnNames.Account.ingameUuid, nullable: true })
	ingameUuid: string;

	@Column({ name: ColumnNames.Account.email, unique: true })
	email: string;

	@Column({ name: ColumnNames.Account.avatar, nullable: true, type: "text" })
	avatar: string;

	@Column({ name: ColumnNames.Account.displayName })
	displayName: string;

	@Column({ name: ColumnNames.Account.password, length: 300 })
	password: string;

	@CreateDateColumn({ name: ColumnNames.Global.createdAt })
	createdAt: Date;

	@Column({ name: ColumnNames.Global.createdById, nullable: true })
	createdById: string;

	@ManyToOne(() => AccountEntity, {
		createForeignKeyConstraints: false,
		nullable: true,
	})
	@JoinColumn({ name: ColumnNames.Global.createdById })
	createdBy: AccountEntity;

	@Column({ name: ColumnNames.Account.lastLoginAt, nullable: true })
	lastLoginAt: Date;

	@Column({
		name: ColumnNames.Account.role,
		type: "int",
		default: AccountRole.USER,
	})
	role: AccountRole;

	@Column({ name: ColumnNames.StaffRole.id, nullable: true })
	staffRoleId: number;

	@ManyToOne(() => StaffRoleEntity, {
		nullable: true,
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.StaffRole.id })
	staffRole: StaffRoleEntity;

	@Column({ name: ColumnNames.Account.isActive, default: true })
	isActive: boolean;
}
