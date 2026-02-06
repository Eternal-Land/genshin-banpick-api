import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Put,
	Query,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CharacterCostService } from "./character-cost.service";
import {
	BaseApiResponse,
	SwaggerBaseApiMessageResponse,
	SwaggerBaseApiResponse,
} from "@utils";
import {
	CharacterCostCharacterResponse,
	CharacterCostQuery,
	UpdateCharacterCostRequest,
} from "./dto";

@Controller("/admin/character-cost")
@ApiBearerAuth()
export class CharacterCostController {
	constructor(private readonly characterCostService: CharacterCostService) {}

	@Get("/sync")
	@SwaggerBaseApiMessageResponse()
	async syncWithCharacters() {
		await this.characterCostService.syncWithCharacters();
		return BaseApiResponse.success();
	}

	@Get()
	@SwaggerBaseApiResponse(CharacterCostCharacterResponse, { isArray: true })
	async getAllCharacterCosts(@Query() query: CharacterCostQuery) {
		const { characters, next } =
			await this.characterCostService.getAllCharacterCosts(query);
		return BaseApiResponse.successWithCursor(
			CharacterCostCharacterResponse.fromEntities(characters),
			next,
		);
	}

	@Put("/:characterCostId")
	@SwaggerBaseApiMessageResponse()
	async updateCharacterCost(
		@Param("characterCostId", ParseIntPipe) characterCostId: number,
		@Body() dto: UpdateCharacterCostRequest,
	) {
		await this.characterCostService.updateCharacterCost(characterCostId, dto);
		return BaseApiResponse.success();
	}
}
