import { CostMilestoneRepository } from "@db/repositories";
import { Injectable, Logger } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { costMilestoneRawData } from "../raw-data/character-cost-milestone";
import { store } from "../store";

@Injectable()
export class CharacterCostMilestoneSeederService {
	private readonly logger = new Logger(
		CharacterCostMilestoneSeederService.name,
	);
	constructor(
		private readonly characterCostMilestoneRepo: CostMilestoneRepository,
	) {}

	@Transactional()
	async seed() {
		this.logger.log("Seeding character cost milestones...");

		const milestones = await this.characterCostMilestoneRepo.find({ take: 1 });
		if (milestones.length > 0) {
			this.logger.log(
				`Character cost milestones already exist. Skipping seeding...`,
			);
			return;
		}

		await this.characterCostMilestoneRepo.insert(
			costMilestoneRawData.map((item) =>
				this.characterCostMilestoneRepo.create({
					...item,
					createdById: store.adminAccount!.id,
				}),
			),
		);

		this.logger.log("Character cost milestones seeded successfully.");
	}
}
