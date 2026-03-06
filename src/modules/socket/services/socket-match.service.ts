import { Injectable } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { Socket } from "socket.io";
import { SocketEventType } from "@utils/types";
import { MatchRepository } from "@db/repositories";
import { SocketEvents } from "@utils/constants";
import { ProfileResponse } from "@modules/self/dto";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class SocketMatchService {
	constructor(
		private readonly socketService: SocketService,
		private readonly matchRepository: MatchRepository,
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
			relations: { participants: { participant: true } },
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
			const matchParticipant = match.participants.find(
				(mp) => mp.participantId == accountId,
			);
			if (matchParticipant) {
				client.data.currentMatchId = matchId;
				this.emitToMatch(
					matchId,
					SocketEvents.PARTICIPANT_JOINED,
					ProfileResponse.fromEntity(matchParticipant.participant),
				);
			}
		}
		const matchRoom = this.buildMatchRoomName(matchId);
		client.join(matchRoom);
	}

	async leaveMatchRoom(client: Socket, matchId: string) {
		const match = await this.checkMatchExists(matchId);
		if (client.data?.profile) {
			const accountId = client.data.profile.id;
			const matchParticipant = match.participants.find(
				(mp) => mp.participantId == accountId,
			);
			if (matchParticipant) {
				this.emitToMatch(
					matchId,
					SocketEvents.PARTICIPANT_LEFT,
					ProfileResponse.fromEntity(matchParticipant.participant),
				);
			}
		}
		const matchRoom = this.buildMatchRoomName(matchId);
		client.leave(matchRoom);
	}
}
