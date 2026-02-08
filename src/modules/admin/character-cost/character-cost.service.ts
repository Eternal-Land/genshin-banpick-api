import { CharacterCostEntity, CharacterEntity } from "@db/entities";
import { CharacterCostRepository, CharacterRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { CharacterCostQuery, UpdateCharacterCostRequest } from "./dto";
import { CharacterCostNotFoundError } from "./errors";

@Injectable()
export class CharacterCostService {
	constructor(
		private readonly characterCostRepo: CharacterCostRepository,
		private readonly characterRepo: CharacterRepository,
	) {}

	async getAllCharacterCosts(query: CharacterCostQuery) {
		const charQueryBuilder = this.characterRepo.createQueryBuilder("character");

		if (query.startId) {
			charQueryBuilder.andWhere("character.id >= :startId", {
				startId: query.startId,
			});
		}
		if (!query.showInactive) {
			charQueryBuilder.andWhere("character.isActive = :isActive", {
				isActive: true,
			});
		}

		if (query.element && query.element.length > 0) {
			charQueryBuilder.andWhere("character.element IN (:...elements)", {
				elements: query.element,
			});
		}

		if (query.search) {
			charQueryBuilder.andWhere(
				"(character.name LIKE :search OR character.key LIKE :search)",
				{ search: `%${query.search}%` },
			);
		}

		const characters = await charQueryBuilder
			.select([
				"character.id",
				"character.key",
				"character.name",
				"character.iconUrl",
				"character.rarity",
			])
			.innerJoinAndSelect("character.characterCosts", "characterCosts")
			.take(query.limit + 1) // Limit to 11 to check if there are more records for pagination
			.orderBy("character.id", "ASC")
			.getMany();

		let next: number | undefined = undefined;
		if (characters.length > query.limit) {
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
		if (!character.isActive) {
			await this.characterCostRepo.delete({ characterId: character.id });
			return;
		}

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
