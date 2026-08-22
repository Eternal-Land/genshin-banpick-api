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
import { UserSessionRecordService } from "@modules/user/session-record";
import { SaveSessionRecordRequest } from "@modules/user/session-record/dto";
import { MatchService } from "@modules/user/match";

type SaveMatchTimerInputsPayload = {
	matchId?: string;
	matchSessionId?: number;
	record?: SaveSessionRecordRequest;
};

type UpdateBanPickSlotPayload = {
	matchId?: string;
	side?: "blue" | "red";
	type?: "ban" | "pick";
	character?: {
		id?: string;
		name?: string;
		imageUrl?: string;
		rarity?: number;
		level?: number;
		constellation?: number;
		cost?: number;
		element?: string;
		weaponType?: string;
	};
	updatedBy?: string;
};

type SwapBanPickSlotPositionPayload = {
	matchId?: string;
	side?: "blue" | "red";
	sourceTeamOrder?: number;
	targetTeamOrder?: number;
	updatedBy?: string;
};

type UpdatePickSlotPayload = {
	matchId?: string;
	side?: "blue" | "red";
	teamOrder?: number;
	characterId?: number;
	characterConstellation?: number;
	weaponRefinement?: number;
	characterLevel?: number;
	updatedBy?: string;
};

type UpdateTeamCostPayload = {
	matchId?: string;
	teamSide?: "blue" | "red";
	chamberIndex?: number;
	accountId?: string;
	isUsedStar?: boolean;
	updatedBy?: string;
};

type UpdateChamberClearTimePayload = {
	matchId?: string;
	matchSessionId?: number;
	teamSide?: "blue" | "red";
	chamberIndex?: number;
	clearTimeSeconds?: number;
	updatedBy?: string;
};

const SESSION_RECORD_FIELDS: Array<keyof SaveSessionRecordRequest> = [
	"blueChamber1",
	"blueChamber2",
	"blueChamber3",
	"blueResetTimes",
	"blueFinalTime",
	"redChamber1",
	"redChamber2",
	"redChamber3",
	"redResetTimes",
	"redFinalTime",
];

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
		private readonly userSessionRecordService: UserSessionRecordService,
		private readonly matchService: MatchService,
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
		return await this.socketMatchService.joinMatchRoom(client, matchId);
	}

	@SubscribeMessage(SocketEvents.LEAVE_MATCH_ROOM)
	@SkipAuth()
	async handleLeaveMatchRoom(client: Socket, matchId: string) {
		await this.socketMatchService.leaveMatchRoom(client, matchId);
		return { ok: true };
	}

	@SubscribeMessage(SocketEvents.UPDATE_MATCH_TIMER_INPUTS)
	@SkipAuth()
	async handleSyncMatchTimerInputs(
		client: Socket,
		payload: {
			matchId?: string;
			timerInputs?: {
				blue?: {
					chamber1?: string;
					chamber2?: string;
					chamber3?: string;
					reset?: string;
				};
				red?: {
					chamber1?: string;
					chamber2?: string;
					chamber3?: string;
					reset?: string;
				};
			};
			updatedBy?: string;
		},
	) {
		if (!payload?.matchId || !payload?.timerInputs) {
			return { ok: false };
		}

		this.socketMatchService.emitToMatch(
			payload.matchId,
			SocketEvents.UPDATE_MATCH_TIMER_INPUTS,
			{
				timerInputs: payload.timerInputs,
				updatedBy: payload.updatedBy,
			},
		);

		return { ok: true };
	}

	@SubscribeMessage(SocketEvents.UPDATE_BAN_PICK_SLOT)
	async handleUpdateBanPickSlot(
		client: Socket,
		payload: UpdateBanPickSlotPayload,
	) {
		if (!payload?.matchId || !payload?.side || !payload?.character?.id) {
			return { ok: false };
		}

		const profileId = client.data?.profile?.id;
		if (!profileId) {
			throw new WsException("Unauthorized");
		}

		const characterId = Number(payload.character.id);
		if (!Number.isInteger(characterId) || characterId <= 0) {
			throw new WsException("Invalid character id");
		}

		if (payload.type === "ban") {
			await this.matchService.banCharFromSocket(
				payload.matchId,
				characterId,
				profileId,
			);
		} else {
			await this.matchService.pickCharFromSocket(
				payload.matchId,
				characterId,
				profileId,
			);
		}

		this.socketMatchService.emitToMatch(
			payload.matchId,
			SocketEvents.UPDATE_BAN_PICK_SLOT,
			{
				side: payload.side,
				character: payload.character,
				updatedBy: payload.updatedBy ?? profileId,
			},
		);

		return { ok: true };
	}

	@SubscribeMessage(SocketEvents.SWAP_BAN_PICK_SLOT_POSITION)
	async handleSwapBanPickSlotPosition(
		client: Socket,
		payload: SwapBanPickSlotPositionPayload,
	) {
		if (
			!payload?.matchId ||
			!payload?.side ||
			!Number.isInteger(payload?.sourceTeamOrder) ||
			!Number.isInteger(payload?.targetTeamOrder)
		) {
			return { ok: false };
		}

		const profileId = client.data?.profile?.id;
		if (!profileId) {
			throw new WsException("Unauthorized");
		}

		const sourceTeamOrder = Number(payload.sourceTeamOrder);
		const targetTeamOrder = Number(payload.targetTeamOrder);
		if (
			sourceTeamOrder <= 0 ||
			targetTeamOrder <= 0 ||
			sourceTeamOrder === targetTeamOrder
		) {
			return { ok: false };
		}

		await this.matchService.swapBanPickSlotTeamOrderFromSocket(
			payload.matchId,
			payload.side,
			sourceTeamOrder,
			targetTeamOrder,
			profileId,
		);

		this.socketMatchService.emitToMatch(
			payload.matchId,
			SocketEvents.SWAP_BAN_PICK_SLOT_POSITION,
			{
				side: payload.side,
				sourceTeamOrder,
				targetTeamOrder,
				updatedBy: payload.updatedBy ?? profileId,
			},
		);

		return { ok: true };
	}

	@SubscribeMessage(SocketEvents.UPDATE_PICK_SLOT)
	async handleUpdatePickSlot(client: Socket, payload: UpdatePickSlotPayload) {
		if (
			!payload?.matchId ||
			!payload?.side ||
			!Number.isInteger(payload?.teamOrder) ||
			!Number.isInteger(payload?.characterId) ||
			!Number.isInteger(payload?.characterConstellation) ||
			!Number.isInteger(payload?.weaponRefinement) ||
			!Number.isInteger(payload?.characterLevel)
		) {
			return { ok: false };
		}

		const profileId = client.data?.profile?.id;
		if (!profileId) {
			throw new WsException("Unauthorized");
		}

		await this.matchService.updateSlotBuildFromSocket(
			payload.matchId,
			payload.side,
			payload.teamOrder,
			payload.characterId,
			payload.characterConstellation,
			payload.weaponRefinement,
			payload.characterLevel,
			profileId,
		);

		this.socketMatchService.emitToMatch(
			payload.matchId,
			SocketEvents.UPDATE_PICK_SLOT,
			{
				side: payload.side,
				teamOrder: payload.teamOrder,
				characterId: payload.characterId,
				characterConstellation: payload.characterConstellation,
				weaponRefinement: payload.weaponRefinement,
				characterLevel: payload.characterLevel,
				updatedBy: payload.updatedBy ?? profileId,
			},
		);

		return { ok: true };
	}

	@SubscribeMessage(SocketEvents.UPDATE_TEAM_COST)
	async handleUpdateTeamCost(client: Socket, payload: UpdateTeamCostPayload) {
		if (
			!payload?.matchId ||
			!payload?.teamSide ||
			!Number.isInteger(payload?.chamberIndex) ||
			!payload?.accountId ||
			typeof payload.isUsedStar !== "boolean"
		) {
			return { ok: false };
		}

		const profileId = client.data?.profile?.id;
		if (!profileId) {
			throw new WsException("Unauthorized");
		}

		await this.matchService.updateTeamCostFromSocket(
			payload.matchId,
			payload.teamSide,
			payload.chamberIndex,
			payload.accountId,
			payload.isUsedStar,
			profileId,
		);

		return { ok: true };
	}

	@SubscribeMessage(SocketEvents.UPDATE_CHAMBER_CLEAR_TIME)
	async handleUpdateChamberClearTime(
		client: Socket,
		payload: UpdateChamberClearTimePayload,
	) {
		if (
			!payload?.matchId ||
			!Number.isInteger(payload?.matchSessionId) ||
			!payload?.teamSide ||
			!Number.isInteger(payload?.chamberIndex) ||
			!Number.isInteger(payload?.clearTimeSeconds)
		) {
			return { ok: false };
		}

		const profileId = client.data?.profile?.id;
		if (!profileId) {
			throw new WsException("Unauthorized");
		}

		await this.userSessionRecordService.updateChamberClearTimeFromSocket(
			payload.matchSessionId,
			payload.teamSide,
			payload.chamberIndex,
			payload.clearTimeSeconds,
			profileId,
		);

		this.socketMatchService.emitToMatch(
			payload.matchId,
			SocketEvents.UPDATE_CHAMBER_CLEAR_TIME,
			{
				matchSessionId: payload.matchSessionId,
				teamSide: payload.teamSide,
				chamberIndex: payload.chamberIndex,
				clearTimeSeconds: payload.clearTimeSeconds,
				updatedBy: payload.updatedBy ?? profileId,
			},
		);

		return { ok: true };
	}

	@SubscribeMessage(SocketEvents.SAVE_MATCH_TIMER_INPUTS)
	async handleSaveMatchTimerInputs(
		client: Socket,
		payload: SaveMatchTimerInputsPayload,
	) {
		const matchSessionId = Number(payload?.matchSessionId);
		if (!Number.isInteger(matchSessionId) || matchSessionId <= 0) {
			throw new WsException("Invalid matchSessionId");
		}

		if (!this.isValidSessionRecord(payload?.record)) {
			throw new WsException("Invalid session record payload");
		}

		const profileId = client.data?.profile?.id;
		if (!profileId) {
			throw new WsException("Unauthorized");
		}

		await this.userSessionRecordService.save(
			matchSessionId,
			payload.record,
			profileId,
		);

		if (payload?.matchId) {
			this.socketMatchService.emitToMatch(
				payload.matchId,
				SocketEvents.SAVE_MATCH_TIMER_INPUTS,
				{
					matchSessionId,
					record: payload.record,
					updatedBy: profileId,
				},
			);
		}

		return { ok: true };
	}

	private isValidSessionRecord(
		record: SaveSessionRecordRequest | undefined,
	): record is SaveSessionRecordRequest {
		if (!record) {
			return false;
		}

		return SESSION_RECORD_FIELDS.every((field) => {
			const value = record[field];
			return Number.isInteger(value) && value >= 0;
		});
	}
}
