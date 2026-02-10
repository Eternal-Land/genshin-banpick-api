import { Body, Controller, Get, Put, Query } from "@nestjs/common";
import { WeaponCostService } from "./weapon-cost.service";
import {
	BaseApiResponse,
	RequirePermission,
	SwaggerBaseApiMessageResponse,
	SwaggerBaseApiResponse,
} from "@utils";
import {
	UpdateWeaponCostRequest,
	WeaponCostQuery,
	WeaponCostWeaponResponse,
} from "./dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("/admin/weapon-costs")
@ApiBearerAuth()
export class WeaponCostController {
	constructor(private readonly weaponCostService: WeaponCostService) {}

	@Get("/sync")
	@RequirePermission("admin.weapon-cost.sync")
	@SwaggerBaseApiMessageResponse()
	async syncWithWeapons() {
		await this.weaponCostService.syncWithWeapons();
		return BaseApiResponse.success();
	}

	@Get()
	@RequirePermission("admin.weapon-cost.list")
	@SwaggerBaseApiResponse(WeaponCostWeaponResponse, {
		isArray: true,
		withCursor: true,
	})
	async listWeaponCosts(@Query() query: WeaponCostQuery) {
		const { next, weapons } =
			await this.weaponCostService.listWeaponCosts(query);
		return BaseApiResponse.successWithCursor(
			WeaponCostWeaponResponse.fromEntities(weapons),
			next,
		);
	}

	@Put(":weaponCostId")
	@RequirePermission("admin.weapon-cost.update")
	@SwaggerBaseApiMessageResponse()
	async updateWeaponCost(
		@Query("weaponCostId") weaponCostId: number,
		@Body() dto: UpdateWeaponCostRequest,
	) {
		await this.weaponCostService.updateWeaponCost(weaponCostId, dto);
		return BaseApiResponse.success();
	}
}
