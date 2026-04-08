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
import { SessionCostRequest, SessionCostResponse } from "./dto";
import { UserSessionCostService } from "./session-cost.service";

@Controller("/user/session-cost")
@ApiBearerAuth()
export class UserSessionCostController {
	constructor(private readonly sessionCostService: UserSessionCostService) {}

	@Get(":matchId/current")
	@SwaggerBaseApiResponse(SessionCostResponse)
	async getCurrentSessionCost(@Param("matchId") matchId: string) {
		const sessionCost =
			await this.sessionCostService.getCurrentSessionCost(matchId);
		return BaseApiResponse.success(SessionCostResponse.fromEntity(sessionCost));
	}

	@Put(":matchSessionId/calculate")
	@SwaggerBaseApiResponse(SessionCostResponse)
	async calculate(
		@Param("matchSessionId", ParseIntPipe) matchSessionId: number,
		@Body() dto: SessionCostRequest,
	) {
		const sessionCost = await this.sessionCostService.calculate(
			matchSessionId,
			dto,
		);
		return BaseApiResponse.success(SessionCostResponse.fromEntity(sessionCost));
	}
}
