import { CharacterRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserCharacterCostService {
	constructor(private readonly characterRepo: CharacterRepository) {}

	async listCharacterCosts() {
		return this.characterRepo.find({
			where: { isActive: true },
			relations: {
				characterCosts: true,
			},
			order: {
				element: "ASC",
				rarity: "DESC",
				name: "ASC",
				characterCosts: {
					constellation: "ASC",
				},
			},
		});
	}
}
