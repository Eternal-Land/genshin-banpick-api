import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserQuery, UserResponse } from "./dto";
import { BaseApiResponse, PaginationDto, SwaggerBaseApiResponse } from "@utils";
import { RequirePermission } from "@utils/decorators";

@Controller("/admin/users")
@ApiBearerAuth()
@ApiTags("Admin Users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@RequirePermission("admin.users.list")
	@SwaggerBaseApiResponse(UserResponse, { isArray: true })
	async listUsers(@Query() query: UserQuery) {
		const { users, total } = await this.userService.listUsers(query);
		return BaseApiResponse.successWithPagination(
			UserResponse.fromEntities(users),
			PaginationDto.from(query.page, query.take, total),
		);
	}
}
