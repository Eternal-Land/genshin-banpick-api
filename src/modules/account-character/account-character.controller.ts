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
import { AccountCharacterService } from "./account-character.service";
import {
	AccountCharacterQuery,
	AccountCharacterResponse,
	CreateAccountCharacterRequest,
	UpdateAccountCharacterRequest,
} from "./dto";
import {
	BaseApiResponse,
	PaginationDto,
	SwaggerBaseApiMessageResponse,
	SwaggerBaseApiResponse,
} from "@utils";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("account-character")
@ApiBearerAuth()
export class AccountCharacterController {
	constructor(
		private readonly accountCharacterService: AccountCharacterService,
	) {}

	@Post()
	@SwaggerBaseApiResponse(AccountCharacterResponse)
	async createOne(@Body() dto: CreateAccountCharacterRequest) {
		const accountCharacter = await this.accountCharacterService.createOne(dto);
		return BaseApiResponse.success(
			AccountCharacterResponse.fromEntity(accountCharacter),
		);
	}

	@Put(":id")
	@SwaggerBaseApiResponse(AccountCharacterResponse)
	async updateOne(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateAccountCharacterRequest,
	) {
		const accountCharacter = await this.accountCharacterService.updateOne(
			id,
			dto,
		);
		return BaseApiResponse.success(
			AccountCharacterResponse.fromEntity(accountCharacter),
		);
	}

	@Get()
	@SwaggerBaseApiResponse(AccountCharacterResponse, {
		isArray: true,
		withPagination: true,
	})
	async findMany(@Query() query: AccountCharacterQuery) {
		const { items, total } = await this.accountCharacterService.findMany(query);
		return BaseApiResponse.successWithPagination(
			AccountCharacterResponse.fromEntities(items),
			PaginationDto.from(query.page, query.take, total),
		);
	}

	@Get(":id")
	@SwaggerBaseApiResponse(AccountCharacterResponse)
	async findOne(@Param("id", ParseUUIDPipe) id: string) {
		const accountCharacter = await this.accountCharacterService.findOne(id);
		return BaseApiResponse.success(
			AccountCharacterResponse.fromEntity(accountCharacter),
		);
	}

	@Delete(":id")
	@SwaggerBaseApiMessageResponse()
	async deleteOne(@Param("id", ParseUUIDPipe) id: string) {
		await this.accountCharacterService.deleteOne(id);
		return BaseApiResponse.success();
	}
}
