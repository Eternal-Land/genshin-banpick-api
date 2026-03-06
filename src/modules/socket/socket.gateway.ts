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
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { SocketGuard } from "./socket.guard";
import { SocketEvents } from "@utils/constants";
import { SkipAuth } from "@utils";

@WebSocketGateway()
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
		await this.socketService.initializeConnection(client);
	}

	async handleDisconnect(client: Socket) {
		console.log("Client disconnected:", client.id);
		await this.socketMatchService.leaveMatchRoom(
			client,
			client.data?.currentMatchId,
		);
	}

	@SubscribeMessage(SocketEvents.JOIN_MATCH_ROOM)
	@SkipAuth()
	async handleJoinMatchRoom(client: Socket, matchId: string) {
		await this.socketMatchService.joinMatchRoom(client, matchId);
	}
}
