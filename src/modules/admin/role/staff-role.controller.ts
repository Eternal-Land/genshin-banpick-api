import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
} from "@nestjs/common";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import {
	CreateStaffRoleRequest,
	StaffRoleResponse,
	UpdateStaffRoleRequest,
} from "./dto";
import { StaffRoleService } from "./staff-role.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { RequirePermission } from "@utils/decorators";

@Controller("/admin/staff-roles")
@ApiBearerAuth()
export class StaffRoleController {
	constructor(private readonly roleService: StaffRoleService) {}

	@Get()
	@RequirePermission("admin.staff-role.list")
	@SwaggerBaseApiResponse(StaffRoleResponse, { isArray: true })
	async listRoles() {
		const roles = await this.roleService.listRoles();
		return BaseApiResponse.success(StaffRoleResponse.fromEntities(roles));
	}

	@Get(":id")
	@RequirePermission("admin.staff-role.detail")
	@SwaggerBaseApiResponse(StaffRoleResponse)
	async getStaffRole(@Param("id", ParseIntPipe) id: number) {
		const role = await this.roleService.getStaffRole(id);
		return BaseApiResponse.success(StaffRoleResponse.fromEntity(role));
	}

	@Post()
	@RequirePermission("admin.staff-role.create")
	@SwaggerBaseApiResponse(StaffRoleResponse)
	async createRole(@Body() dto: CreateStaffRoleRequest) {
		const role = await this.roleService.createRole(dto);
		return BaseApiResponse.success(StaffRoleResponse.fromEntity(role));
	}

	@Put(":id")
	@RequirePermission("admin.staff-role.update")
	@SwaggerBaseApiResponse(StaffRoleResponse)
	async updateRole(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateStaffRoleRequest,
	) {
		const role = await this.roleService.updateRole(id, dto);
		return BaseApiResponse.success(StaffRoleResponse.fromEntity(role));
	}

	@Post(":id/copy")
	@RequirePermission("admin.staff-role.copy")
	@SwaggerBaseApiResponse(StaffRoleResponse)
	async copyRole(@Param("id", ParseIntPipe) id: number) {
		const role = await this.roleService.copyRole(id);
		return BaseApiResponse.success(StaffRoleResponse.fromEntity(role));
	}

	@Put(":id/toggle-active")
	@RequirePermission("admin.staff-role.update")
	@SwaggerBaseApiResponse(StaffRoleResponse)
	async toggleRoleStatus(@Param("id", ParseIntPipe) id: number) {
		const role = await this.roleService.toggleRoleActive(id);
		return BaseApiResponse.success(StaffRoleResponse.fromEntity(role));
	}
}
