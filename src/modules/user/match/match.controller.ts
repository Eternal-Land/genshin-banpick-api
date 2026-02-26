import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
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
	UpdateMatchRequest,
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

	@Put(":id")
	@SwaggerBaseApiResponse(MatchResponse)
	@ApiBearerAuth()
	async updateOne(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateMatchRequest,
	) {
		const match = await this.matchService.updateOne(id, dto);
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
}
