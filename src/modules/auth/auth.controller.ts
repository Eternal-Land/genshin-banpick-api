import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { BasicLoginRequest, RegisterRequest, TokenResponse } from "./dto";
import {
	BaseApiResponse,
	SwaggerBaseApiMessageResponse,
	SwaggerBaseApiResponse,
} from "@utils";
import { SkipAuth } from "@utils/decorators";

@Controller("/auth")
@SkipAuth()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/register")
	@SwaggerBaseApiMessageResponse()
	async register(@Body() dto: RegisterRequest) {
		await this.authService.register(dto);
		return BaseApiResponse.success();
	}

	@Post("/login/basic")
	@SwaggerBaseApiResponse(TokenResponse)
	async basicLogin(@Body() dto: BasicLoginRequest) {
		const data = await this.authService.loginBasic(dto);
		return BaseApiResponse.success(data);
	}
}
