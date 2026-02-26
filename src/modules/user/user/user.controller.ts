import { Controller, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { BaseApiResponse, PaginationDto, SkipAuth } from "@utils";
import { SearchUserQuery } from "./dto";
import { ProfileResponse } from "@modules/self/dto";

@Controller("/user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("/search")
	@SkipAuth()
	async search(@Query() query: SearchUserQuery) {
		const { users, total } = await this.userService.searchUsers(query);
		return BaseApiResponse.successWithPagination(
			ProfileResponse.fromEntities(users),
			PaginationDto.from(query.page, query.take, total),
		);
	}

	@Get("/find-by-unique-key")
	@SkipAuth()
	async findByUniqueKey(@Query("key") key: string) {
		const user = await this.userService.findByUniqueKey(key);
		return BaseApiResponse.success(ProfileResponse.fromEntity(user));
	}
}
