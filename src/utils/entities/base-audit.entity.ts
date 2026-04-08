import { Column } from "typeorm";

export const BaseAuditColumns = {
	createdAt: "created_at",
	createdBy: "created_by",
	updatedAt: "updated_at",
	updatedBy: "updated_by",
	isDeleted: "is_deleted",
} as const;

export class BaseAuditEntity {
	@Column({
		name: BaseAuditColumns.createdAt,
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	createdAt: Date;

	@Column({ name: BaseAuditColumns.createdBy, type: "varchar", nullable: true })
	createdBy: string;

	@Column({
		name: BaseAuditColumns.updatedAt,
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date;

	@Column({ name: BaseAuditColumns.updatedBy, type: "varchar", nullable: true })
	updatedBy: string;

	@Column({ name: BaseAuditColumns.isDeleted, type: "boolean", default: false })
	isDeleted: boolean;
}
