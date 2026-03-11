import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { BasicLoginRequest, RegisterRequest, TokenResponse } from "./dto";
import {
	BaseApiResponse,
	Env,
	SwaggerBaseApiMessageResponse,
	SwaggerBaseApiResponse,
} from "@utils";
import { SkipAuth } from "@utils/decorators";
import { Response } from "express";

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
	async basicLogin(@Body() dto: BasicLoginRequest, @Res() res: Response) {
		const data = await this.authService.loginBasic(dto);
		res.cookie("accessToken", data.accessToken, {
			httpOnly: true,
			sameSite: "lax",
			domain: Env.COOKIE_DOMAIN,
			secure: Env.COOKIE_SECURE,
			path: "/",
			maxAge: Env.JWT_AT_EXPIRATION,
		});
		return res.status(200).send(BaseApiResponse.success(data));
	}

	@Post("/logout")
	@SwaggerBaseApiMessageResponse()
	async logout(@Res() res: Response) {
		res.clearCookie("accessToken", {
			httpOnly: true,
			sameSite: "lax",
			domain: Env.COOKIE_DOMAIN,
			secure: Env.COOKIE_SECURE,
		});
		return res.status(200).send(BaseApiResponse.success());
	}
}
