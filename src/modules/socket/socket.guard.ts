import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";
import { SKIP_AUTH_KEY } from "@utils";
import { Reflector } from "@nestjs/core";
import { SocketService } from "./services";

@Injectable()
export class SocketGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly socketService: SocketService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client = context.switchToWs().getClient<Socket>();

		const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (skipAuth) {
			return true;
		}

		if (this.hasFreshProfile(client)) {
			return true;
		}

		try {
			await this.socketService.syncAuthFromToken(client, true);
			return true;
		} catch (error) {
			if (error instanceof WsException) {
				throw error;
			}
			throw new WsException("Unauthorized");
		}
	}

	private hasFreshProfile(client: Socket): boolean {
		const profile = client.data?.profile;
		const profileExpireAt = client.data?.profileExpireAt;
		if (!profile || typeof profileExpireAt !== "number") {
			return false;
		}

		return profileExpireAt > Date.now();
	}
}
