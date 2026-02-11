import { CharacterCostRepository, CharacterRepository } from "@db/repositories";
import { Injectable, Logger } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { characterCostsRawData } from "../raw-data/character-costs";

@Injectable()
export class CharacterCostSeederService {
	private readonly logger = new Logger(CharacterCostSeederService.name);
	constructor(
		private readonly characterCostRepo: CharacterCostRepository,
		private readonly characterRepo: CharacterRepository,
	) {}

	private async handleSingleCharacterCost(
		characterKey: string,
		costs: number[],
	) {
		const character = await this.characterRepo.findOneBy({ key: characterKey });
		if (!character) {
			this.logger.warn(
				`Character with key "${characterKey}" not found. Skipping...`,
			);
			return;
		}
		const existedCosts = await this.characterCostRepo.findBy({
			characterId: character.id,
		});
		if (existedCosts.length > 0) {
			this.logger.log(
				`Character costs for character "${characterKey}" already exist. Skipping...`,
			);
			return;
		}
		for (let i = 0; i < costs.length; i++) {
			const costValue = costs[i];
			const characterCost = this.characterCostRepo.create({
				characterId: character.id,
				constellation: i + 1,
				cost: costValue,
			});
			await this.characterCostRepo.save(characterCost);
		}
	}

	@Transactional()
	async seed() {
		this.logger.log("Seeding character costs...");

		await Promise.all(
			characterCostsRawData.map((item) =>
				this.handleSingleCharacterCost(item.key, item.costs),
			),
		);

		this.logger.log("Character costs seeded successfully.");
	}
}
