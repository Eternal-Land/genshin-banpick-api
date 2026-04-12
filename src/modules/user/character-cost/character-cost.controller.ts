import { CharacterCostCharacterResponse } from "@modules/admin/character-cost/dto";
import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { UserCharacterCostService } from "./character-cost.service";

@Controller("/user/character-costs")
@ApiBearerAuth()
export class UserCharacterCostController {
	constructor(
		private readonly userCharacterCostService: UserCharacterCostService,
	) {}

	@Get()
	@SwaggerBaseApiResponse(CharacterCostCharacterResponse, { isArray: true })
	async listCharacterCosts() {
		const costs = await this.userCharacterCostService.listCharacterCosts();
		return BaseApiResponse.success(
			CharacterCostCharacterResponse.fromEntities(costs),
		);
	}
}
