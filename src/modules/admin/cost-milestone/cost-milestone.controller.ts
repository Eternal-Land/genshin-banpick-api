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
import { CostMilestoneService } from "./cost-milestone.service";
import {
	CostMilestoneQuery,
	CostMilestoneResponse,
	CreateCostMilestoneRequest,
	UpdateCostMilestoneRequest,
} from "./dto";

@Controller("/admin/cost-milestones")
@ApiBearerAuth()
export class CostMilestoneController {
	constructor(private readonly costMilestoneService: CostMilestoneService) {}

	@Get()
	@RequirePermission("admin.cost-milestone.list")
	@SwaggerBaseApiResponse(CostMilestoneResponse, { isArray: true })
	async listCostMilestones(@Query() query: CostMilestoneQuery) {
		const { costMilestones, total } =
			await this.costMilestoneService.listCostMilestones(query);
		return BaseApiResponse.success(
			CostMilestoneResponse.fromEntities(costMilestones),
			PaginationDto.from(query.page, query.take, total),
		);
	}

	@Get(":id")
	@RequirePermission("admin.cost-milestone.detail")
	@SwaggerBaseApiResponse(CostMilestoneResponse)
	async getCostMilestone(@Param("id", ParseIntPipe) id: number) {
		const costMilestone = await this.costMilestoneService.getCostMilestone(id);
		return BaseApiResponse.success(
			CostMilestoneResponse.fromEntity(costMilestone),
		);
	}

	@Post()
	@RequirePermission("admin.cost-milestone.create")
	@SwaggerBaseApiResponse(CostMilestoneResponse)
	async createCostMilestone(@Body() dto: CreateCostMilestoneRequest) {
		const costMilestone =
			await this.costMilestoneService.createCostMilestone(dto);
		return BaseApiResponse.success(
			CostMilestoneResponse.fromEntity(costMilestone),
		);
	}

	@Put(":id")
	@RequirePermission("admin.cost-milestone.update")
	@SwaggerBaseApiResponse(CostMilestoneResponse)
	async updateCostMilestone(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateCostMilestoneRequest,
	) {
		const costMilestone = await this.costMilestoneService.updateCostMilestone(
			id,
			dto,
		);
		return BaseApiResponse.success(
			CostMilestoneResponse.fromEntity(costMilestone),
		);
	}

	@Put(":id/toggle-active")
	@RequirePermission("admin.cost-milestone.update")
	@SwaggerBaseApiResponse(CostMilestoneResponse)
	async toggleActive(@Param("id", ParseIntPipe) id: number) {
		const costMilestone = await this.costMilestoneService.toggleActive(id);
		return BaseApiResponse.success(
			CostMilestoneResponse.fromEntity(costMilestone),
		);
	}
}
