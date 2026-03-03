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
	InviteParticipantRequest,
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

	@Post("invite")
	@SwaggerBaseApiMessageResponse()
	@ApiBearerAuth()
	async inviteParticipant(@Body() dto: InviteParticipantRequest) {
		await this.matchService.inviteParticipant(dto);
		return BaseApiResponse.success();
	}

	@Post("accept-invitation/:invitationId")
	async acceptInvitation(
		@Param("invitationId", ParseUUIDPipe) invitationId: string,
	) {
		await this.matchService.acceptInvitation(invitationId);
		return BaseApiResponse.success();
	}

	@Post("deny-invitation/:invitationId")
	async denyInvitation(
		@Param("invitationId", ParseUUIDPipe) invitationId: string,
	) {
		await this.matchService.denyInvitation(invitationId);
		return BaseApiResponse.success();
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

	@Post(":id/remove-participant/:participantId")
	@SwaggerBaseApiMessageResponse()
	@ApiBearerAuth()
	async removeParticipant(
		@Param("id", ParseUUIDPipe) id: string,
		@Param("participantId", ParseUUIDPipe) participantId: string,
	) {
		await this.matchService.removeParticipant(id, participantId);
		return BaseApiResponse.success();
	}

	@Post(":id/join")
	@SwaggerBaseApiMessageResponse()
	@ApiBearerAuth()
	async joinMatch(@Param("id", ParseUUIDPipe) id: string) {
		await this.matchService.joinAsParticipant(id);
		return BaseApiResponse.success();
	}

	@Post(":id/leave")
	@SwaggerBaseApiMessageResponse()
	@ApiBearerAuth()
	async leaveMatch(@Param("id", ParseUUIDPipe) id: string) {
		await this.matchService.leaveMatch(id);
		return BaseApiResponse.success();
	}
}
