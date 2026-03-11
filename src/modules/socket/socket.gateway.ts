import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WsException,
} from "@nestjs/websockets";
import { SocketMatchService, SocketService } from "./services";
import { Socket, Server as SocketIOServer } from "socket.io";
import {
	UseFilters,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { SocketGuard } from "./socket.guard";
import { SocketEvents } from "@utils/constants";
import { SkipAuth } from "@utils";
import { SocketExceptionFilter } from "./socket.exception-filter";

@WebSocketGateway()
@UseFilters(SocketExceptionFilter)
@UsePipes(
	new ValidationPipe({ exceptionFactory: (errors) => new WsException(errors) }),
)
@UseGuards(SocketGuard)
export class SocketGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private readonly socketService: SocketService,
		private readonly socketMatchService: SocketMatchService,
	) {}

	// Init the gateway and set the server instance in the service
	afterInit(server: SocketIOServer) {
		this.socketService.server = server;
	}

	async handleConnection(client: Socket) {
		console.log("Client connected:", client.id);
		try {
			await this.socketService.initializeConnection(client);
		} catch (error) {
			const errorMsg =
				error instanceof WsException
					? String(error.getError())
					: error instanceof Error
						? error.message
						: "An unexpected error occurred";
			client.emit(SocketEvents.ERROR, errorMsg);
		}
	}

	async handleDisconnect(client: Socket) {
		console.log("Client disconnected:", client.id);
		try {
			await this.socketMatchService.leaveMatchRoom(client);
		} catch (error) {
			const errorMsg =
				error instanceof WsException
					? String(error.getError())
					: error instanceof Error
						? error.message
						: "An unexpected error occurred";
			client.emit(SocketEvents.ERROR, errorMsg);
		}
	}

	@SubscribeMessage(SocketEvents.JOIN_MATCH_ROOM)
	@SkipAuth()
	async handleJoinMatchRoom(client: Socket, matchId: string) {
		await this.socketMatchService.joinMatchRoom(client, matchId);
		return { ok: true };
	}

	@SubscribeMessage(SocketEvents.LEAVE_MATCH_ROOM)
	@SkipAuth()
	async handleLeaveMatchRoom(client: Socket, matchId: string) {
		await this.socketMatchService.leaveMatchRoom(client, matchId);
		return { ok: true };
	}
}
