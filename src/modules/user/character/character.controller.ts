import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { CharacterResponse } from "@modules/admin/character/dto";
import { UserCharacterService } from "./character.service";

@Controller("/user/characters")
@ApiBearerAuth()
export class UserCharacterController {
	constructor(private readonly characterService: UserCharacterService) {}

	@Get()
	@SwaggerBaseApiResponse(CharacterResponse, { isArray: true })
	async listCharacters() {
		const characters = await this.characterService.listCharacters();
		return BaseApiResponse.success(CharacterResponse.fromEntities(characters));
	}
}
