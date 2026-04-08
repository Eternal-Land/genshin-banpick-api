import { CharacterRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserCharacterService {
	constructor(private readonly characterRepo: CharacterRepository) {}

	async listCharacters() {
		return this.characterRepo.find({
			where: { isActive: true },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
			order: {
				name: "ASC",
			},
		});
	}
}
