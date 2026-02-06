import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { BaseApiResponse, PaginationDto, SwaggerBaseApiResponse } from "@utils";
import { RequirePermission } from "@utils/decorators";
import { WeaponService } from "./weapon.service";
import {
	WeaponResponse,
	CreateWeaponRequest,
	UpdateWeaponRequest,
	WeaponQuery,
} from "./dto";

@Controller("/admin/weapons")
@ApiBearerAuth()
export class WeaponController {
	constructor(private readonly weaponService: WeaponService) {}

	@Get()
	@RequirePermission("admin.weapon.list")
	@SwaggerBaseApiResponse(WeaponResponse, { isArray: true })
	async listWeapons(@Query() query: WeaponQuery) {
		const { weapons, total } = await this.weaponService.listWeapons(query);
		return BaseApiResponse.successWithPagination(
			WeaponResponse.fromEntities(weapons),
			PaginationDto.from(query.page, query.take, total),
		);
	}

	@Get(":id")
	@RequirePermission("admin.weapon.detail")
	@SwaggerBaseApiResponse(WeaponResponse)
	async getWeapon(@Param("id", ParseIntPipe) id: number) {
		const weapon = await this.weaponService.getWeapon(id);
		return BaseApiResponse.success(WeaponResponse.fromEntity(weapon));
	}

	@Post()
	@RequirePermission("admin.weapon.create")
	@SwaggerBaseApiResponse(WeaponResponse)
	async createWeapon(@Body() dto: CreateWeaponRequest) {
		const weapon = await this.weaponService.createWeapon(dto);
		return BaseApiResponse.success(WeaponResponse.fromEntity(weapon));
	}

	@Put(":id")
	@RequirePermission("admin.weapon.update")
	@SwaggerBaseApiResponse(WeaponResponse)
	async updateWeapon(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateWeaponRequest,
	) {
		const weapon = await this.weaponService.updateWeapon(id, dto);
		return BaseApiResponse.success(WeaponResponse.fromEntity(weapon));
	}

	@Put(":id/toggle-active")
	@RequirePermission("admin.weapon.update")
	@SwaggerBaseApiResponse(WeaponResponse)
	async toggleActive(@Param("id", ParseIntPipe) id: number) {
		const weapon = await this.weaponService.toggleActive(id);
		return BaseApiResponse.success(WeaponResponse.fromEntity(weapon));
	}
}
