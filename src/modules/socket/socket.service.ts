import { Injectable } from "@nestjs/common";
import { SocketEventType } from "@utils/types";
import { parseCookie } from "cookie";
import { Socket, Server as SocketIOServer } from "socket.io";
import * as jwt from "jsonwebtoken";

@Injectable()
export class SocketService {
	// Init by the gateway
	server: SocketIOServer;
	constructor() {}

	buildUserRoomName(userId: string) {
		return `user_${userId}`;
	}

	buildMatchRoomName(matchId: string) {
		return `match_${matchId}`;
	}

	async initializeConnection(client: Socket) {
		const cookies = parseCookie(client.handshake.headers.cookie || "");
		const token = cookies["accessToken"];
		if (!token) return;
		try {
			const payload = jwt.verify(
				token,
				process.env.JWT_AT_SECRET,
			) as jwt.JwtPayload;
			const accountId = payload?.sub as string | undefined;
			if (!accountId) return;

			// Join a room with the user's account ID for targeted messaging
			const userRoom = this.buildUserRoomName(accountId);
			client.join(userRoom);
		} catch (err) {
			// Invalid token, ignore and don't join any rooms
		}
	}

	emitToUser(userId: string, event: SocketEventType, data?: any) {
		const userRoom = this.buildUserRoomName(userId);
		this.server.to(userRoom).emit(event, data);
	}

	emitToMatch(matchId: string, event: SocketEventType, data?: any) {
		const matchRoom = this.buildMatchRoomName(matchId);
		this.server.to(matchRoom).emit(event, data);
	}
}
