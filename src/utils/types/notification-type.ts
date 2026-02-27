import { NotificationType } from "@utils/constants";

export type NotificationTypeEnum =
	(typeof NotificationType)[keyof typeof NotificationType];
