import { Body, Controller, Get, Put } from "@nestjs/common";
import { SelfService } from "./self.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { ProfileResponse, UpdateProfileRequest } from "./dto";

@Controller("self")
@ApiBearerAuth()
export class SelfController {
	constructor(private readonly selfService: SelfService) {}

	@Get()
	@SwaggerBaseApiResponse(ProfileResponse)
	async getProfile() {
		const profile = this.selfService.getSelf();
		return BaseApiResponse.success(profile);
	}

	@Put()
	@SwaggerBaseApiResponse(ProfileResponse)
	async updateProfile(@Body() dto: UpdateProfileRequest) {
		const profile = await this.selfService.updateProfile(dto);
		return BaseApiResponse.success(profile);
	}
}
