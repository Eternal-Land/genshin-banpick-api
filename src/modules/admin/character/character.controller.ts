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
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { RequirePermission } from "@utils/decorators";
import { CharacterService } from "./character.service";
import {
	CharacterQuery,
	CharacterResponse,
	CreateCharacterRequest,
	UpdateCharacterRequest,
} from "./dto";

@Controller("/admin/characters")
@ApiBearerAuth()
export class CharacterController {
	constructor(private readonly characterService: CharacterService) {}

	@Get()
	@RequirePermission("admin.character.list")
	@SwaggerBaseApiResponse(CharacterResponse, { isArray: true })
	async listCharacters(@Query() query: CharacterQuery) {
		const characters = await this.characterService.listCharacters(query);
		return BaseApiResponse.success(CharacterResponse.fromEntities(characters));
	}

	@Get(":id")
	@RequirePermission("admin.character.detail")
	@SwaggerBaseApiResponse(CharacterResponse)
	async getCharacter(@Param("id", ParseIntPipe) id: number) {
		const character = await this.characterService.getCharacter(id);
		return BaseApiResponse.success(CharacterResponse.fromEntity(character));
	}

	@Post()
	@RequirePermission("admin.character.create")
	@SwaggerBaseApiResponse(CharacterResponse)
	async createCharacter(@Body() dto: CreateCharacterRequest) {
		const character = await this.characterService.createCharacter(dto);
		return BaseApiResponse.success(CharacterResponse.fromEntity(character));
	}

	@Put(":id")
	@RequirePermission("admin.character.update")
	@SwaggerBaseApiResponse(CharacterResponse)
	async updateCharacter(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateCharacterRequest,
	) {
		const character = await this.characterService.updateCharacter(id, dto);
		return BaseApiResponse.success(CharacterResponse.fromEntity(character));
	}

	@Put(":id/toggle-active")
	@RequirePermission("admin.character.update")
	@SwaggerBaseApiResponse(CharacterResponse)
	async toggleActive(@Param("id", ParseIntPipe) id: number) {
		const character = await this.characterService.toggleActive(id);
		return BaseApiResponse.success(CharacterResponse.fromEntity(character));
	}
}
