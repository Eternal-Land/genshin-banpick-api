import { CharacterCostEntity, CharacterEntity } from "@db/entities";
import { CharacterCostRepository, CharacterRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { CharacterCostQuery, UpdateCharacterCostRequest } from "./dto";
import { MoreThanOrEqual } from "typeorm";
import { CharacterCostNotFoundError } from "./errors";

@Injectable()
export class CharacterCostService {
	constructor(
		private readonly characterCostRepo: CharacterCostRepository,
		private readonly characterRepo: CharacterRepository,
	) {}

	async getAllCharacterCosts(query: CharacterCostQuery) {
		const characters = await this.characterRepo.find({
			where: {
				id: query.startId ? MoreThanOrEqual(query.startId) : undefined,
				...(query.showInactive ? {} : { isActive: true }),
			},
			relations: {
				characterCosts: true,
			},
			order: {
				id: "ASC",
			},
			// Limit to 11 to check if there are more records for pagination
			take: 11,
			select: ["id", "key", "name", "iconUrl", "rarity", "characterCosts"],
		});
		let next: number | undefined = undefined;
		if (characters.length > 10) {
			const lastCharacter = characters.pop();
			next = lastCharacter.id;
		}
		return { characters, next };
	}

	async syncWithCharacters() {
		const characters = await this.characterRepo.find();
		const promises: Promise<void>[] = [];
		for (const char of characters) {
			promises.push(this.handleCharacterCostSync(char));
		}
		await Promise.all(promises);
	}

	private async handleCharacterCostSync(character: CharacterEntity) {
		const existingCosts = await this.characterCostRepo.find({
			where: { characterId: character.id },
		});
		const existingConstellations = new Set<number>();
		for (const cost of existingCosts) {
			existingConstellations.add(cost.constellation);
		}
		const newCosts: CharacterCostEntity[] = [];
		for (let constellation = 0; constellation <= 6; constellation++) {
			if (!existingConstellations.has(constellation)) {
				newCosts.push(
					this.characterCostRepo.create({
						characterId: character.id,
						constellation,
						cost: 0,
					}),
				);
			}
		}
		await this.characterCostRepo.save(newCosts);
	}

	async updateCharacterCost(
		characterCostId: number,
		dto: UpdateCharacterCostRequest,
	) {
		const characterCost = await this.characterCostRepo.findOne({
			where: { id: characterCostId },
		});
		if (!characterCost) {
			throw new CharacterCostNotFoundError();
		}
		characterCost.cost = dto.cost;
		await this.characterCostRepo.save(characterCost);
	}
}
