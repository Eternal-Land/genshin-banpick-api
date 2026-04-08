import { Injectable } from "@nestjs/common";
import { SocketEventType } from "@utils/types";
import { parseCookie } from "cookie";
import { Socket, Server as SocketIOServer } from "socket.io";
import * as jwt from "jsonwebtoken";
import { AccountRepository } from "@db/repositories";
import { Env } from "@utils";
import { ProfileResponse } from "@modules/self/dto";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class SocketService {
	// Init by the gateway
	server: SocketIOServer;
	constructor(private readonly accountRepo: AccountRepository) {}

	buildUserRoomName(userId: string) {
		return `user_${userId}`;
	}

	async initializeConnection(client: Socket): Promise<void> {
		await this.syncAuthFromToken(client, false);
	}

	async syncAuthFromToken(client: Socket, strict = true): Promise<boolean> {
		const token = this.getTokenFromClient(client);
		if (!token) {
			this.clearAuthData(client);
			if (strict) {
				throw new WsException("Unauthorized");
			}
			return false;
		}

		try {
			const payload = jwt.verify(token, Env.JWT_AT_SECRET) as jwt.JwtPayload;
			const accountId = payload?.sub as string | undefined;
			const expireAt = (payload?.exp ?? 0) * 1000;

			if (!accountId || !expireAt) {
				this.clearAuthData(client);
				if (strict) {
					throw new WsException("Unauthorized");
				}
				return false;
			}

			const account = await this.accountRepo.findOne({
				where: { id: accountId },
				relations: [
					"staffRole",
					"staffRole.permissions",
					"staffRole.permissions.permission",
				],
			});

			if (!account) {
				this.clearAuthData(client);
				throw new WsException("Unauthorized");
			}

			if (!account.isActive) {
				this.clearAuthData(client);
				throw new WsException("Account is inactive");
			}

			client.data = {
				...client.data,
				profile: ProfileResponse.fromEntity(account),
				profileExpireAt: expireAt,
			};

			const userRoom = this.buildUserRoomName(accountId);
			if (!client.rooms.has(userRoom)) {
				client.join(userRoom);
			}

			return true;
		} catch (error) {
			if (error instanceof WsException) {
				throw error;
			}

			this.clearAuthData(client);
			if (strict) {
				throw new WsException("Unauthorized");
			}
			return false;
		}
	}

	emitToUser(userId: string, event: SocketEventType, data?: any) {
		const userRoom = this.buildUserRoomName(userId);
		this.server.to(userRoom).emit(event, data);
	}

	private getTokenFromClient(client: Socket): string | null {
		const cookies = parseCookie(client.handshake.headers.cookie || "");
		return cookies["accessToken"] || null;
	}

	private clearAuthData(client: Socket): void {
		delete client.data?.profile;
		delete client.data?.profileExpireAt;
	}
}
