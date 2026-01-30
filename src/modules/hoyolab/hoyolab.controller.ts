import { Body, Controller, Post } from "@nestjs/common";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { SkipAuth } from "@utils/decorators";
import { CharacterListRequest, CharacterListResponse } from "./dto";
import { HoyolabService } from "./hoyolab.service";

@Controller("/hoyolab")
export class HoyolabController {
	constructor(private readonly hoyolabService: HoyolabService) {}

	@Post("/characters")
	@SkipAuth()
	@SwaggerBaseApiResponse(CharacterListResponse)
	async getCharacterList(@Body() dto: CharacterListRequest) {
		const data = await this.hoyolabService.getCharacterList(dto);
		return BaseApiResponse.success(data);
	}
}
