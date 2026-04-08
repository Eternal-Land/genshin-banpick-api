import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	ParseUUIDPipe,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import {
	BaseApiResponse,
	PaginationDto,
	SkipAuth,
	SwaggerBaseApiMessageResponse,
	SwaggerBaseApiResponse,
} from "@utils";
import {
	CreateMatchRequest,
	MatchQuery,
	MatchResponse,
	MatchStateResponse,
} from "./dto";
import { MatchService } from "./match.service";

@Controller("/user/match")
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	@Post()
	@SwaggerBaseApiResponse(MatchResponse)
	@ApiBearerAuth()
	async createOne(@Body() dto: CreateMatchRequest) {
		const match = await this.matchService.createOne(dto);
		return BaseApiResponse.success(MatchResponse.fromEntity(match));
	}

	@Get()
	@SwaggerBaseApiResponse(MatchResponse, {
		isArray: true,
		withPagination: true,
	})
	@SkipAuth()
	async findMany(@Query() query: MatchQuery) {
		const { items, total } = await this.matchService.findMany(query);
		return BaseApiResponse.successWithPagination(
			MatchResponse.fromEntities(items),
			PaginationDto.from(query.page, query.take, total),
		);
	}

	@Get(":id/state")
	@SwaggerBaseApiResponse(MatchStateResponse)
	@SkipAuth()
	async getMatchState(@Param("id", ParseUUIDPipe) id: string) {
		const matchState = await this.matchService.getMatchState(id);
		return BaseApiResponse.success(MatchStateResponse.fromEntity(matchState));
	}

	@Get(":id")
	@SwaggerBaseApiResponse(MatchResponse)
	@ApiBearerAuth()
	async findOne(@Param("id", ParseUUIDPipe) id: string) {
		const match = await this.matchService.findOne(id);
		return BaseApiResponse.success(MatchResponse.fromEntity(match));
	}

	@Delete(":id")
	@SwaggerBaseApiMessageResponse()
	@ApiBearerAuth()
	async deleteOne(@Param("id", ParseUUIDPipe) id: string) {
		await this.matchService.deleteOne(id);
		return BaseApiResponse.success();
	}

	@Put(":id/start")
	@SwaggerBaseApiMessageResponse()
	@ApiBearerAuth()
	async startMatch(@Param("id", ParseUUIDPipe) id: string) {
		await this.matchService.startMatch(id);
		return BaseApiResponse.success();
	}

	@Post(":id/complete-session")
	@SwaggerBaseApiMessageResponse()
	@ApiBearerAuth()
	async completeSession(@Param("id", ParseUUIDPipe) id: string) {
		await this.matchService.completeCurrentSession(id);
		return BaseApiResponse.success();
	}

	@Put(":id/pick-char/:charId")
	@SwaggerBaseApiMessageResponse()
	@ApiBearerAuth()
	async pickChar(
		@Param("id", ParseUUIDPipe) id: string,
		@Param("charId", ParseIntPipe) charId: number,
	) {
		await this.matchService.pickChar(id, charId);
		return BaseApiResponse.success();
	}

	@Put(":id/ban-char/:charId")
	@SwaggerBaseApiMessageResponse()
	@ApiBearerAuth()
	async banChar(
		@Param("id", ParseUUIDPipe) id: string,
		@Param("charId", ParseIntPipe) charId: number,
	) {
		await this.matchService.banChar(id, charId);
		return BaseApiResponse.success();
	}

	@Put(":id/pick-weapon/:charId/:weaponId/:weaponRefinement")
	@SwaggerBaseApiMessageResponse()
	@ApiBearerAuth()
	async pickWeapon(
		@Param("id", ParseUUIDPipe) id: string,
		@Param("charId", ParseIntPipe) charId: number,
		@Param("weaponId") weaponId: string,
		@Param("weaponRefinement", ParseIntPipe) weaponRefinement: number,
	) {
		await this.matchService.pickWeapon(id, charId, weaponId, weaponRefinement);
		return BaseApiResponse.success();
	}
}
