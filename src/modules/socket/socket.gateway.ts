import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WsException,
} from "@nestjs/websockets";
import { SocketService } from "./socket.service";
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
	constructor(private readonly socketService: SocketService) {}

	// Init the gateway and set the server instance in the service
	afterInit(server: SocketIOServer) {
		this.socketService.server = server;
	}

	async handleConnection(client: Socket) {
		console.log("Client connected:", client.id);
		await this.socketService.initializeConnection(client);
	}

	handleDisconnect(client: Socket) {
		console.log("Client disconnected:", client.id);
	}

	@SubscribeMessage(SocketEvents.JOIN_MATCH_ROOM)
	@SkipAuth()
	handleJoinMatchRoom(client: Socket, matchId: string) {
		const roomName = this.socketService.buildMatchRoomName(matchId);
		client.join(roomName);
	}
}
