import { NotificationEntity } from "@db/entities";
import { Builder } from "builder-pattern";

export class NotificationResponse {
	id: string;
	type: string;
	content: string;
	isRead: boolean;
	createdAt: Date;

	static from(notification: NotificationEntity): NotificationResponse {
		return Builder(NotificationResponse)
			.id(notification.id)
			.type(notification.type)
			.content(notification.content)
			.isRead(notification.isRead)
			.createdAt(notification.createdAt)
			.build();
	}
}
