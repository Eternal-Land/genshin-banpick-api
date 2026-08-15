import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { SessionStateResponse } from "./dto";
import { UserSessionStateService } from "./session-state.service";

@Controller("/user/session-state")
@ApiBearerAuth()
export class UserSessionStateController {
	constructor(private readonly sessionStateService: UserSessionStateService) {}

	@Get(":matchId/current")
	@SwaggerBaseApiResponse(SessionStateResponse)
	async getCurrentSessionState(@Param("matchId") matchId: string) {
		const sessionState =
			await this.sessionStateService.getCurrentSessionState(matchId);
		return BaseApiResponse.success(
			SessionStateResponse.fromEntity(
				sessionState.matchSessionId,
				sessionState.banPickSlots,
				sessionState.teamCosts,
			),
		);
	}
}
