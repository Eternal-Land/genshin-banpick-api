import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { parseCookie } from "cookie";
import { AccountRepository } from "@db/repositories";
import { WsException } from "@nestjs/websockets";
import * as jwt from "jsonwebtoken";
import { Env, SKIP_AUTH_KEY } from "@utils";
import { ProfileResponse } from "@modules/self/dto";
import { Reflector } from "@nestjs/core";

@Injectable()
export class SocketGuard implements CanActivate {
	constructor(
		private readonly accountRepo: AccountRepository,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext) {
		const client = context.switchToWs().getClient<Socket>();

		const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (skipAuth) {
			return true;
		}

		const token = this.getTokenFromClient(client);

		if (!token) {
			throw new WsException("Unauthorized");
		}

		try {
			const payload = jwt.verify(token, Env.JWT_AT_SECRET) as jwt.JwtPayload;
			const accountId = payload?.sub as string | undefined;
			if (!accountId) {
				throw new WsException("Unauthorized");
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
				throw new WsException("Unauthorized");
			}

			if (!account.isActive) {
				throw new WsException("Account is inactive");
			}

			client.data = {
				...client.data,
				profile: ProfileResponse.fromEntity(account),
			};

			if (!client.rooms.has(accountId)) {
				client.join(accountId);
			}

			return true;
		} catch (error) {
			if (error instanceof WsException) {
				throw error;
			}
			throw new WsException("Unauthorized");
		}
	}

	private getTokenFromClient(client: Socket): string | null {
		const cookies = parseCookie(client.handshake.headers.cookie || "");
		return cookies["accessToken"] || null;
	}
}
