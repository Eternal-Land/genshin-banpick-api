import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Put,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import {
	MatchReportDetailResponse,
	SaveSessionRecordRequest,
	SessionRecordResponse,
} from "./dto";
import { UserSessionRecordService } from "./session-record.service";

@Controller("/user/session-record")
@ApiBearerAuth()
export class UserSessionRecordController {
	constructor(
		private readonly sessionRecordService: UserSessionRecordService,
	) {}

	@Put(":matchSessionId/save")
	@SwaggerBaseApiResponse(SessionRecordResponse)
	async save(
		@Param("matchSessionId", ParseIntPipe) matchSessionId: number,
		@Body() dto: SaveSessionRecordRequest,
	) {
		const sessionRecord = await this.sessionRecordService.save(
			matchSessionId,
			dto,
		);
		return BaseApiResponse.success(
			SessionRecordResponse.fromEntity(sessionRecord),
		);
	}

	@Get(":matchId/report")
	@SwaggerBaseApiResponse(MatchReportDetailResponse)
	async getMatchReport(@Param("matchId") matchId: string) {
		const report = await this.sessionRecordService.getMatchReport(matchId);
		return BaseApiResponse.success(
			MatchReportDetailResponse.fromEntity(
				report.match,
				report.sessions,
				report.recordsBySessionId,
				report.costsBySessionId,
			),
		);
	}
}
