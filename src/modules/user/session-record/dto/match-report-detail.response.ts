import {
	MatchEntity,
	MatchSessionEntity,
	SessionCostEntity,
	SessionRecordEntity,
} from "@db/entities";
import { SessionCostResponse } from "@modules/user/session-cost/dto/session-cost.response";
import { ProfileResponse } from "@modules/self/dto";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";
import {
	MatchSessionStatus,
	MatchStatus,
	MatchType,
	PlayerSide,
} from "@utils/enums";

class SessionRecordSummaryResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	matchSessionId: number;

	@ApiProperty()
	blueChamber1: number;

	@ApiProperty()
	blueChamber2: number;

	@ApiProperty()
	blueChamber3: number;

	@ApiProperty()
	blueResetTimes: number;

	@ApiProperty()
	blueFinalTime: number;

	@ApiProperty()
	redChamber1: number;

	@ApiProperty()
	redChamber2: number;

	@ApiProperty()
	redChamber3: number;

	@ApiProperty()
	redResetTimes: number;

	@ApiProperty()
	redFinalTime: number;

	static fromEntity(entity: SessionRecordEntity): SessionRecordSummaryResponse {
		return Builder(SessionRecordSummaryResponse)
			.id(entity.id)
			.matchSessionId(entity.matchSessionId)
			.blueChamber1(entity.blueChamber1)
			.blueChamber2(entity.blueChamber2)
			.blueChamber3(entity.blueChamber3)
			.blueResetTimes(entity.blueResetTimes)
			.blueFinalTime(entity.blueFinalTime)
			.redChamber1(entity.redChamber1)
			.redChamber2(entity.redChamber2)
			.redChamber3(entity.redChamber3)
			.redResetTimes(entity.redResetTimes)
			.redFinalTime(entity.redFinalTime)
			.build();
	}
}

class MatchSessionReportItemResponse {
	@ApiProperty()
	matchSessionId: number;

	@ApiProperty()
	sessionIndex: number;

	@ApiProperty({ enum: MatchSessionStatus })
	sessionStatus: MatchSessionStatus;

	@ApiProperty({ enum: PlayerSide })
	currentTurn: PlayerSide;

	@ApiProperty()
	totalCostBlue: number;

	@ApiProperty()
	totalCostRed: number;

	@ApiProperty({ type: ProfileResponse, nullable: true })
	blueParticipant: ProfileResponse | null;

	@ApiProperty({ type: ProfileResponse, nullable: true })
	redParticipant: ProfileResponse | null;

	@ApiProperty({
		type: Number,
		nullable: true,
		enum: [PlayerSide.BLUE, PlayerSide.RED],
	})
	winnerSide: PlayerSide | null;

	@ApiProperty({ type: Number, nullable: true })
	blueFinalTime: number | null;

	@ApiProperty({ type: Number, nullable: true })
	redFinalTime: number | null;

	@ApiProperty({ type: Number, nullable: true })
	blueResultTotal: number | null;

	@ApiProperty({ type: Number, nullable: true })
	redResultTotal: number | null;

	@ApiProperty({ type: Number, nullable: true })
	resultDifference: number | null;

	@ApiProperty({ type: () => SessionRecordSummaryResponse, nullable: true })
	record: SessionRecordSummaryResponse | null;

	@ApiProperty({ type: () => SessionCostResponse, nullable: true })
	cost: SessionCostResponse | null;
}

export class MatchReportDetailResponse {
	@ApiProperty()
	matchId: string;

	@ApiProperty({ enum: MatchStatus })
	status: MatchStatus;

	@ApiProperty({ enum: MatchType })
	type: MatchType;

	@ApiProperty()
	sessionCount: number;

	@ApiProperty({ type: ProfileResponse, nullable: true })
	host: ProfileResponse | null;

	@ApiProperty({ type: ProfileResponse, nullable: true })
	redPlayer: ProfileResponse | null;

	@ApiProperty({ type: ProfileResponse, nullable: true })
	bluePlayer: ProfileResponse | null;

	@ApiProperty({ type: MatchSessionReportItemResponse, isArray: true })
	sessions: MatchSessionReportItemResponse[];

	private static resolveWinner(
		record?: SessionRecordEntity | null,
		cost?: SessionCostEntity | null,
	): PlayerSide | null {
		const totals = this.resolveResultTotals(record, cost);
		if (!totals) {
			return null;
		}

		const { blueTotalTime, redTotalTime } = totals;

		if (blueTotalTime === redTotalTime) {
			return null;
		}

		return blueTotalTime < redTotalTime ? PlayerSide.BLUE : PlayerSide.RED;
	}

	private static resolveResultTotals(
		record?: SessionRecordEntity | null,
		cost?: SessionCostEntity | null,
	): { blueTotalTime: number; redTotalTime: number } | null {
		if (!record) {
			return null;
		}

		const blueTotalTime =
			Number(cost?.blueTimeBonusCost ?? 0) +
			Math.max(0, Number(record.blueChamber1)) +
			Math.max(0, Number(record.blueChamber2)) +
			Math.max(0, Number(record.blueChamber3));

		const redTotalTime =
			Number(cost?.redTimeBonusCost ?? 0) +
			Math.max(0, Number(record.redChamber1)) +
			Math.max(0, Number(record.redChamber2)) +
			Math.max(0, Number(record.redChamber3));

		return { blueTotalTime, redTotalTime };
	}

	static fromEntity(
		match: MatchEntity,
		sessions: MatchSessionEntity[],
		recordsBySessionId: Map<number, SessionRecordEntity>,
		costsBySessionId: Map<number, SessionCostEntity>,
	): MatchReportDetailResponse {
		const mappedSessions = sessions.map((session) => {
			const record = recordsBySessionId.get(session.id) ?? null;
			const cost = costsBySessionId.get(session.id) ?? null;
			const winnerSide = this.resolveWinner(record, cost);
			const resultTotals = this.resolveResultTotals(record, cost);
			return Builder(MatchSessionReportItemResponse)
				.matchSessionId(session.id)
				.sessionIndex(session.sessionIndex)
				.sessionStatus(session.sessionStatus)
				.currentTurn(session.currentTurn)
				.totalCostBlue(Number(session.totalCostBlue))
				.totalCostRed(Number(session.totalCostRed))
				.blueParticipant(
					session.blueParticipant
						? ProfileResponse.fromEntity(session.blueParticipant)
						: null,
				)
				.redParticipant(
					session.redParticipant
						? ProfileResponse.fromEntity(session.redParticipant)
						: null,
				)
				.winnerSide(winnerSide)
				.blueFinalTime(record?.blueFinalTime ?? null)
				.redFinalTime(record?.redFinalTime ?? null)
				.blueResultTotal(resultTotals?.blueTotalTime ?? null)
				.redResultTotal(resultTotals?.redTotalTime ?? null)
				.resultDifference(
					resultTotals
						? Math.abs(resultTotals.blueTotalTime - resultTotals.redTotalTime)
						: null,
				)
				.record(record ? SessionRecordSummaryResponse.fromEntity(record) : null)
				.cost(cost ? SessionCostResponse.fromEntity(cost) : null)
				.build();
		});

		return Builder(MatchReportDetailResponse)
			.matchId(match.id)
			.status(match.status)
			.type(match.type)
			.sessionCount(match.sessionCount)
			.host(match.host ? ProfileResponse.fromEntity(match.host) : null)
			.redPlayer(
				match.redPlayer ? ProfileResponse.fromEntity(match.redPlayer) : null,
			)
			.bluePlayer(
				match.bluePlayer ? ProfileResponse.fromEntity(match.bluePlayer) : null,
			)
			.sessions(mappedSessions)
			.build();
	}
}
