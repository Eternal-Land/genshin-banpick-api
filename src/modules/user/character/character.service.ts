import {
	AccountCharacterRepository,
	CharacterRepository,
} from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { GenshinBanpickCls } from "@utils";

@Injectable()
export class UserCharacterService {
	constructor(
		private readonly characterRepo: CharacterRepository,
		private readonly accountCharacterRepo: AccountCharacterRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
	) {}

	async listCharacters() {
		return this.characterRepo.find({
			where: { isActive: true },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
			order: {
				element: "ASC",
			},
		});
	}

	async searchCharacters(query?: string) {
		const accountId = this.cls.get("profile.id");
		const queryBuilder = this.characterRepo
			.createQueryBuilder("character")
			.where("character.isActive = :isActive", { isActive: true });

		if (query?.trim()) {
			queryBuilder.andWhere(
				"(character.name LIKE :search OR character.key LIKE :search)",
				{ search: `%${query.trim()}%` },
			);
		} else {
			queryBuilder.take(10);
		}

		if (accountId) {
			const ownedItems = await this.accountCharacterRepo.find({
				where: { accountId },
				select: { characterId: true },
			});
			const ownedCharacterIds = ownedItems.map((item) => item.characterId);

			if (ownedCharacterIds.length > 0) {
				queryBuilder.andWhere("character.id NOT IN (:...ownedCharacterIds)", {
					ownedCharacterIds,
				});
			}
		}

		return queryBuilder
			.orderBy("character.rarity", "DESC")
			.addOrderBy("character.name", "ASC")
			.getMany();
	}
}
