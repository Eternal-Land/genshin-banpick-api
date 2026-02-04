import { AccountRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { UserQuery } from "./dto";
import { Brackets } from "typeorm";
import { AccountRole } from "@utils/enums";

@Injectable()
export class UserService {
	constructor(private readonly accountRepo: AccountRepository) {}

	async listUsers(query: UserQuery) {
		const qb = this.accountRepo
			.createQueryBuilder("account")
			.where("account.role = :role", { role: AccountRole.USER });

		if (query.isActive != undefined) {
			qb.andWhere("account.isActive IN (:...isActive)", {
				isActive: query.isActive,
			});
		}

		if (query.search) {
			qb.andWhere(
				new Brackets((qb1) => {
					return qb1
						.where("account.email LIKE :search", {
							search: `%${query.search}%`,
						})
						.orWhere("account.ingameUuid LIKE :search", {
							search: `%${query.search}%`,
						})
						.orWhere("account.displayName LIKE :search", {
							search: `%${query.search}%`,
						});
				}),
			);
		}

		const [users, total] = await Promise.all([
			qb
				.take(query.take)
				.skip((query.page - 1) * query.take)
				.getMany(),
			qb.getCount(),
		]);

		return { users, total };
	}
}
