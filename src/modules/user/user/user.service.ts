import { AccountRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { SearchUserQuery } from "./dto";
import { AccountRole } from "@utils/enums";
import { Brackets } from "typeorm";

@Injectable()
export class UserService {
	constructor(private readonly accountRepo: AccountRepository) {}

	async searchUsers(query: SearchUserQuery) {
		const qb = this.accountRepo
			.createQueryBuilder("account")
			.where("account.role = :role", { role: AccountRole.USER })
			.andWhere("account.isActive = :isActive", { isActive: true });

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

	async findByUniqueKey(key: string) {
		const qb = this.accountRepo
			.createQueryBuilder("account")
			.where("account.role = :role", { role: AccountRole.USER })
			.andWhere("account.isActive = :isActive", { isActive: true })
			.andWhere(
				new Brackets((qb1) => {
					return qb1
						.where("account.email = :key", { key })
						.orWhere("account.ingameUuid = :key", { key })
						.orWhere("account.displayName = :key", { key });
				}),
			);
		return await qb.getOne();
	}
}
