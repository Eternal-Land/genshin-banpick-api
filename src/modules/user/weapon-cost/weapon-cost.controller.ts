import { WeaponCostResponse } from "@modules/admin/weapon-cost/dto";
import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { UserWeaponCostService } from "./weapon-cost.service";

@Controller("/user/weapon-costs")
@ApiBearerAuth()
export class UserWeaponCostController {
	constructor(private readonly userWeaponCostService: UserWeaponCostService) {}

	@Get()
	@SwaggerBaseApiResponse(WeaponCostResponse, { isArray: true })
	async listWeaponCosts() {
		const costs = await this.userWeaponCostService.listWeaponCosts();
		return BaseApiResponse.success(WeaponCostResponse.from(costs));
	}
}
