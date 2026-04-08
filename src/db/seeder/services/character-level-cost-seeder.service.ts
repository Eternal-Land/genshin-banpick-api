import {
	CharacterLevelCostRepository,
	CharacterRepository,
} from "@db/repositories";
import { Injectable, Logger } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { characterLevelCostsRawData } from "../raw-data/character-level-costs";
import { store } from "../store";

@Injectable()
export class CharacterLevelCostSeederService {
	private readonly logger = new Logger(CharacterLevelCostSeederService.name);

	constructor(
		private readonly characterLevelCostRepo: CharacterLevelCostRepository,
		private readonly characterRepo: CharacterRepository,
	) {}

	private async seedSingleCharacterLevelCosts(
		characterKey: string,
		levelCosts: Array<{ level: number; cost: number }>,
	) {
		const character = await this.characterRepo.findOneBy({ key: characterKey });
		if (!character) {
			this.logger.warn(
				`Character with key "${characterKey}" not found. Skipping...`,
			);
			return;
		}

		for (const levelCost of levelCosts) {
			const existed = await this.characterLevelCostRepo.findOneBy({
				characterId: character.id,
				level: levelCost.level,
			});
			if (existed) {
				this.logger.log(
					`Character level cost for "${characterKey}" at level ${levelCost.level} already exists. Skipping...`,
				);
				continue;
			}

			await this.characterLevelCostRepo.insert(
				this.characterLevelCostRepo.create({
					characterId: character.id,
					level: levelCost.level,
					cost: levelCost.cost,
					updatedById: store.adminAccount?.id,
				}),
			);
		}
	}

	@Transactional()
	async seed() {
		this.logger.log("Seeding character level costs...");

		await Promise.all(
			characterLevelCostsRawData.map((item) =>
				this.seedSingleCharacterLevelCosts(item.key, item.levelCosts),
			),
		);

		this.logger.log("Character level costs seeded successfully.");
	}
}
