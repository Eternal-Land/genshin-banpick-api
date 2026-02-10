import {
	Body,
	Controller,
	Get,
	Param,
	ParseEnumPipe,
	ParseIntPipe,
	Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { WeaponCostMilestoneService } from "./weapon-cost-milestone.service";
import { WeaponRarity } from "@utils/enums";
import {
	UpdateWeaponCostMilestoneRequest,
	WeaponCostMilestoneResponse,
} from "./dto";
import {
	BaseApiResponse,
	RequirePermission,
	SwaggerBaseApiMessageResponse,
	SwaggerBaseApiResponse,
} from "@utils";

@Controller("/admin/weapon-cost-milestones")
@ApiBearerAuth()
export class WeaponCostMilestoneController {
	constructor(
		private readonly weaponCostMilestoneService: WeaponCostMilestoneService,
	) {}

	@Put("/:id")
	@RequirePermission("admin.weapon-cost-milestone.update")
	@SwaggerBaseApiMessageResponse()
	async updateWeaponCostMilestone(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateWeaponCostMilestoneRequest,
	) {
		await this.weaponCostMilestoneService.updateWeaponCostMilestone(id, dto);
		return BaseApiResponse.success();
	}

	@Get()
	@RequirePermission("admin.weapon-cost-milestone.list")
	@SwaggerBaseApiResponse(WeaponCostMilestoneResponse, { isArray: true })
	async listWeaponCostMilestones() {
		const entities =
			await this.weaponCostMilestoneService.listWeaponCostMilestones();
		return BaseApiResponse.success(WeaponCostMilestoneResponse.from(entities));
	}
}
