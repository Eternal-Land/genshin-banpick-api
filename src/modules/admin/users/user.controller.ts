import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserQuery, UserResponse } from "./dto";
import { BaseApiResponse, PaginationDto } from "@utils";

@Controller("/admin/users")
@ApiBearerAuth()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async listUsers(@Query() query: UserQuery) {
		const { users, total } = await this.userService.listUsers(query);
		return BaseApiResponse.success(
			UserResponse.fromEntities(users),
			PaginationDto.from(query.page, query.take, total),
		);
	}
}
