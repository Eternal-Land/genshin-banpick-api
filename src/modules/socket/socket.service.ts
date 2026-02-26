import { Injectable } from "@nestjs/common";
import { SocketEventType } from "@utils/types";
import { Server as SocketIOServer } from "socket.io";

@Injectable()
export class SocketService {
	// Init by the gateway
	server: SocketIOServer;
	constructor() {}

	emitToUser(userId: string, event: SocketEventType, data?: any) {
		this.server.to(userId).emit(event, data);
	}
}
