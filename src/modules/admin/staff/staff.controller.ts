import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { StaffService } from "./staff.service";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { RequirePermission } from "@utils/decorators";
import { CreateStaffRequest, StaffResponse, UpdateStaffRequest } from "./dto";

@Controller("/admin/staff")
@ApiBearerAuth()
export class StaffController {
	constructor(private readonly staffService: StaffService) {}

	@Get()
	@RequirePermission("admin.staff.list")
	@SwaggerBaseApiResponse(StaffResponse, { isArray: true })
	async listStaff() {
		const staff = await this.staffService.listStaff();
		return BaseApiResponse.success(StaffResponse.fromEntities(staff));
	}

	@Get(":id")
	@RequirePermission("admin.staff.detail")
	@SwaggerBaseApiResponse(StaffResponse)
	async getStaff(@Param("id", ParseUUIDPipe) id: string) {
		const staff = await this.staffService.getStaff(id);
		return BaseApiResponse.success(StaffResponse.fromEntity(staff));
	}

	@Post()
	@RequirePermission("admin.staff.create")
	@SwaggerBaseApiResponse(StaffResponse)
	async createStaff(@Body() dto: CreateStaffRequest) {
		const staff = await this.staffService.createStaff(dto);
		return BaseApiResponse.success(StaffResponse.fromEntity(staff));
	}

	@Put(":id")
	@RequirePermission("admin.staff.update")
	@SwaggerBaseApiResponse(StaffResponse)
	async updateStaff(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateStaffRequest,
	) {
		const staff = await this.staffService.updateStaff(id, dto);
		return BaseApiResponse.success(StaffResponse.fromEntity(staff));
	}

	@Delete(":id")
	@RequirePermission("admin.staff.delete")
	async deleteStaff(@Param("id", ParseUUIDPipe) id: string) {
		await this.staffService.deleteStaff(id);
		return BaseApiResponse.success();
	}
}
