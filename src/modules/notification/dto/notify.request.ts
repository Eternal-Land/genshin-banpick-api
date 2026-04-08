import { NotificationTypeEnum } from "@utils/types";

export class NotifyRequest {
	userId: string;
	content: string;
	type: NotificationTypeEnum;
}
