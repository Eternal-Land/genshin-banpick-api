import { ColumnNames, TableNames } from "@db/db.constants";
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity(TableNames.Notification)
export class NotificationEntity {
	@PrimaryGeneratedColumn("uuid", { name: ColumnNames.Notification.id })
	id: string;

	@Column({ name: ColumnNames.Account.id })
	accountId: string;

	@Column({ name: ColumnNames.Notification.type })
	type: string;

	@Column({ name: ColumnNames.Notification.content, type: "text" })
	content: string;

	@Column({ name: ColumnNames.Notification.isRead, default: false })
	isRead: boolean;

	@CreateDateColumn({ name: ColumnNames.Global.createdAt })
	createdAt: Date;
}
