import { NotificationRepository } from "@db/repositories";
import { SocketService } from "@modules/socket";
import { Injectable } from "@nestjs/common";
import { NotificationResponse, NotifyRequest } from "./dto";
import { SocketEvents } from "@utils/constants";

@Injectable()
export class NotificationService {
	constructor(
		private readonly socketService: SocketService,
		private readonly notificationRepo: NotificationRepository,
	) {}

	async notify(dto: NotifyRequest) {
		const notification = await this.notificationRepo.save({
			accountId: dto.userId,
			content: dto.content,
			type: dto.type,
		});
		this.socketService.emitToUser(
			dto.userId,
			SocketEvents.NOTIFICATION,
			NotificationResponse.from(notification),
		);
	}
}
