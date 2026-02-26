import { Body, Controller, Post } from "@nestjs/common";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { SkipAuth } from "@utils/decorators";
import { CharacterListRequest, CharacterListResponse } from "./dto";
import { HoyolabService } from "./hoyolab.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("/hoyolab")
@ApiBearerAuth()
export class HoyolabController {
	constructor(private readonly hoyolabService: HoyolabService) {}

	@Post("/characters")
	@SwaggerBaseApiResponse(CharacterListResponse)
	async getCharacterList(@Body() dto: CharacterListRequest) {
		const data = await this.hoyolabService.getCharacterList(dto);
		return BaseApiResponse.success(data);
	}

	@Post("/sync-characters")
	@SwaggerBaseApiResponse(BaseApiResponse)
	async syncCharacters(@Body() dto: CharacterListRequest) {
		const data = await this.hoyolabService.syncCharacters(dto);
		return BaseApiResponse.success(null);
	}
}
