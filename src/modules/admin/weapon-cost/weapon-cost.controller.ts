import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Put,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { WeaponCostService } from "./weapon-cost.service";
import { UpdateWeaponCostRequest, WeaponCostResponse } from "./dto";
import {
	BaseApiResponse,
	RequirePermission,
	SwaggerBaseApiMessageResponse,
	SwaggerBaseApiResponse,
} from "@utils";

@Controller("/admin/weapon-costs")
@ApiBearerAuth()
export class WeaponCostController {
	constructor(private readonly weaponCostService: WeaponCostService) {}

	@Put("/:id")
	@RequirePermission("admin.weapon-cost.update")
	@SwaggerBaseApiMessageResponse()
	async updateWeaponCost(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateWeaponCostRequest,
	) {
		await this.weaponCostService.updateWeaponCost(id, dto);
		return BaseApiResponse.success();
	}

	@Get("/sync")
	@RequirePermission("admin.weapon-cost.sync")
	@SwaggerBaseApiMessageResponse()
	async syncWeaponCosts() {
		await this.weaponCostService.initMilestones();
		return BaseApiResponse.success();
	}

	@Get()
	@RequirePermission("admin.weapon-cost.list")
	@SwaggerBaseApiResponse(WeaponCostResponse, { isArray: true })
	async listWeaponCosts() {
		const entities = await this.weaponCostService.listWeaponCosts();
		return BaseApiResponse.success(WeaponCostResponse.from(entities));
	}

	@Delete()
	@RequirePermission("admin.weapon-cost.clear")
	@SwaggerBaseApiMessageResponse()
	async clearAllWeaponCosts() {
		await this.weaponCostService.clearAllWeaponCosts();
		return BaseApiResponse.success();
	}
}
