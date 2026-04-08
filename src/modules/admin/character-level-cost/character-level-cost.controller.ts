import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { BaseApiResponse, PaginationDto, SwaggerBaseApiResponse } from "@utils";
import { RequirePermission } from "@utils/decorators";
import { CharacterLevelCostService } from "./character-level-cost.service";
import {
	CharacterLevelCostQuery,
	CharacterLevelCostResponse,
	CreateCharacterLevelCostRequest,
	UpdateCharacterLevelCostRequest,
} from "./dto";

@Controller("/admin/character-level-costs")
@ApiBearerAuth()
export class CharacterLevelCostController {
	constructor(
		private readonly characterLevelCostService: CharacterLevelCostService,
	) {}

	@Get()
	@RequirePermission("admin.character-level-cost.list")
	@SwaggerBaseApiResponse(CharacterLevelCostResponse, {
		isArray: true,
		withPagination: true,
	})
	async listCharacterLevelCosts(@Query() query: CharacterLevelCostQuery) {
		const { characterLevelCosts, total } =
			await this.characterLevelCostService.listCharacterLevelCosts(query);
		return BaseApiResponse.successWithPagination(
			CharacterLevelCostResponse.fromEntities(characterLevelCosts),
			PaginationDto.from(query.page, query.take, total),
		);
	}

	@Get(":id")
	@RequirePermission("admin.character-level-cost.detail")
	@SwaggerBaseApiResponse(CharacterLevelCostResponse)
	async getCharacterLevelCost(@Param("id", ParseIntPipe) id: number) {
		const entity =
			await this.characterLevelCostService.getCharacterLevelCost(id);
		return BaseApiResponse.success(
			CharacterLevelCostResponse.fromEntity(entity),
		);
	}

	@Post()
	@RequirePermission("admin.character-level-cost.create")
	@SwaggerBaseApiResponse(CharacterLevelCostResponse)
	async createCharacterLevelCost(@Body() dto: CreateCharacterLevelCostRequest) {
		const entity =
			await this.characterLevelCostService.createCharacterLevelCost(dto);
		return BaseApiResponse.success(
			CharacterLevelCostResponse.fromEntity(entity),
		);
	}

	@Put(":id")
	@RequirePermission("admin.character-level-cost.update")
	@SwaggerBaseApiResponse(CharacterLevelCostResponse)
	async updateCharacterLevelCost(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateCharacterLevelCostRequest,
	) {
		const entity =
			await this.characterLevelCostService.updateCharacterLevelCost(id, dto);
		return BaseApiResponse.success(
			CharacterLevelCostResponse.fromEntity(entity),
		);
	}

	@Delete(":id")
	@RequirePermission("admin.character-level-cost.delete")
	@SwaggerBaseApiResponse(CharacterLevelCostResponse)
	async deleteCharacterLevelCost(@Param("id", ParseIntPipe) id: number) {
		const entity =
			await this.characterLevelCostService.deleteCharacterLevelCost(id);
		return BaseApiResponse.success(
			CharacterLevelCostResponse.fromEntity(entity),
		);
	}
}
