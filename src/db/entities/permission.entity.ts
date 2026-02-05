import { ColumnNames, IndexNames, TableNames } from "@db/db.constants";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity(TableNames.Permission)
export class PermissionEntity {
	@PrimaryGeneratedColumn("increment", { name: ColumnNames.Permission.id })
	id: number;

	@Column({ name: ColumnNames.Permission.description })
	description: string;

	@Column({ name: ColumnNames.Permission.code, unique: true })
	code: string;

	@Index(IndexNames.Permission.deprecated)
	@Column({ name: ColumnNames.Permission.deprecated, default: false })
	deprecated: boolean;
}
