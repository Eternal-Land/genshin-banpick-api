import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { WeaponResponse } from "@modules/admin/weapon/dto";
import { UserWeaponService } from "./weapon.service";

@Controller("/user/weapons")
@ApiBearerAuth()
export class UserWeaponController {
	constructor(private readonly weaponService: UserWeaponService) {}

	@Get()
	@SwaggerBaseApiResponse(WeaponResponse, { isArray: true })
	async listWeapons() {
		const weapons = await this.weaponService.listWeapons();
		return BaseApiResponse.success(WeaponResponse.fromEntities(weapons));
	}
}
