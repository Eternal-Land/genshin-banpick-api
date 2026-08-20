import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { CharacterResponse } from "@modules/admin/character/dto";
import { UserCharacterService } from "./character.service";

@Controller("/user/characters")
@ApiBearerAuth()
export class UserCharacterController {
	constructor(private readonly characterService: UserCharacterService) {}

	@Get("search")
	@SwaggerBaseApiResponse(CharacterResponse, { isArray: true })
	@ApiQuery({
		name: "query",
		required: false,
		type: String,
		description: "Search query for character name or key",
	})
	async searchCharacters(@Query("query") query?: string) {
		const characters = await this.characterService.searchCharacters(query);
		return BaseApiResponse.success(CharacterResponse.fromEntities(characters));
	}

	@Get()
	@SwaggerBaseApiResponse(CharacterResponse, { isArray: true })
	async listCharacters() {
		const characters = await this.characterService.listCharacters();
		return BaseApiResponse.success(CharacterResponse.fromEntities(characters));
	}
}
