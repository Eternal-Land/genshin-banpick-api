import { Injectable } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { Socket } from "socket.io";
import { SocketEventType } from "@utils/types";
import { MatchRepository, MatchStateRepository } from "@db/repositories";
import { SocketEvents } from "@utils/constants";
import { WsException } from "@nestjs/websockets";
import { MatchStateResponse } from "@modules/user/match/dto";

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
		if (client.data?.currentMatchId && client.data?.currentMatchId != matchId) {
			throw new WsException(
				"Already in a match room. Please leave the current match room before joining another.",
			);
		}

		const match = await this.checkMatchExists(matchId);
		const matchState = await this.matchStateRepository.findOneOrCreate(matchId);
		if (matchState && client.data?.profile) {
			const accountId = client.data.profile.id;
			let isStateUpdated = false;

			if (match.hostId == accountId) {
				matchState.hostJoined = true;
				isStateUpdated = true;
			}

			if (match.redPlayerId == accountId) {
				matchState.redPlayerJoined = true;
				isStateUpdated = true;
			}

			if (match.bluePlayerId == accountId) {
				matchState.bluePlayerJoined = true;
				isStateUpdated = true;
			}

			if (isStateUpdated) {
				this.emitToMatch(
					match.id,
					SocketEvents.UPDATE_MATCH_STATE,
					MatchStateResponse.fromEntity(matchState),
				);
				await this.matchStateRepository.save(matchState);
			}
		}
		const matchRoom = this.buildMatchRoomName(matchId);
		if (!client.rooms.has(matchRoom)) {
			client.join(matchRoom);
		}
		client.data = { ...client.data, currentMatchId: matchId };
	}

	async leaveMatchRoom(client: Socket, matchId?: string) {
		matchId = matchId || client.data?.currentMatchId;
		if (!matchId) {
			return;
		}
		const match = await this.matchRepository.findOne({
			where: { id: matchId },
		});
		const matchState = await this.matchStateRepository.findOneOrCreate(matchId);
		if (match && client.data?.profile) {
			const accountId = client.data.profile.id;
			let isStateUpdated = false;

			if (match.hostId == accountId) {
				matchState.hostJoined = false;
				isStateUpdated = true;
			}

			if (match.redPlayerId == accountId) {
				matchState.redPlayerJoined = false;
				isStateUpdated = true;
			}

			if (match.bluePlayerId == accountId) {
				matchState.bluePlayerJoined = false;
				isStateUpdated = true;
			}

			if (isStateUpdated) {
				this.emitToMatch(
					match.id,
					SocketEvents.UPDATE_MATCH_STATE,
					MatchStateResponse.fromEntity(matchState),
				);
				await this.matchStateRepository.save(matchState);
			}
		}
		delete client.data.currentMatchId;
	}
}
