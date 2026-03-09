import { Injectable } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { Socket } from "socket.io";
import { SocketEventType } from "@utils/types";
import { MatchRepository, MatchStateRepository } from "@db/repositories";
import { SocketEvents } from "@utils/constants";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class SocketMatchService {
	constructor(
		private readonly socketService: SocketService,
		private readonly matchRepository: MatchRepository,
		private readonly matchStateRepository: MatchStateRepository,
	) {}

	buildMatchRoomName(matchId: string) {
		return `match_${matchId}`;
	}

	emitToMatch(matchId: string, event: SocketEventType, data?: any) {
		const matchRoom = this.buildMatchRoomName(matchId);
		this.socketService.server.to(matchRoom).emit(event, data);
	}

	private async checkMatchExists(matchId: string) {
		const match = await this.matchRepository.findOne({
			where: { id: matchId },
		});
		if (!match) {
			throw new WsException("Match not found");
		}
		return match;
	}

	async joinMatchRoom(client: Socket, matchId: string) {
		if (client.data.currentMatchId && client.data.currentMatchId != matchId) {
			throw new WsException(
				"Already in a match room. Please leave the current match room before joining another.",
			);
		}

		const match = await this.checkMatchExists(matchId);
		if (client.data?.profile) {
			const accountId = client.data.profile.id;
			if (match.bluePlayerId == accountId || match.redPlayerId == accountId) {
				client.data.currentMatchId = matchId;
				this.emitToMatch(
					matchId,
					SocketEvents.PARTICIPANT_JOINED,
					client.data.profile,
				);
			}
		}
		const matchRoom = this.buildMatchRoomName(matchId);
		client.join(matchRoom);
	}

	async leaveMatchRoom(client: Socket) {
		if (!client.data?.currentMatchId) {
			return;
		}
		const matchId = client.data.currentMatchId;
		const match = await this.matchRepository.findOne({
			where: { id: matchId },
		});
		if (match && client.data?.profile) {
			const accountId = client.data.profile.id;
			if (match.bluePlayerId == accountId || match.redPlayerId == accountId) {
				this.emitToMatch(
					matchId,
					SocketEvents.PARTICIPANT_LEFT,
					client.data.profile,
				);
			}
		}
	}
}
