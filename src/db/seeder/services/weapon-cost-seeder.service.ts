import { WeaponCostEntity } from "@db/entities";
import { WeaponCostRepository } from "@db/repositories";
import { Injectable, Logger } from "@nestjs/common";
import { DeepPartial } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { weaponCostsRawData } from "../raw-data/weapon-costs";

@Injectable()
export class WeaponCostSeederService {
	private readonly logger = new Logger(WeaponCostSeederService.name);
	constructor(private readonly weaponCostRepo: WeaponCostRepository) {}

	private async handleSingleCost(weaponCost: DeepPartial<WeaponCostEntity>) {
		const existed = await this.weaponCostRepo.findOneBy({
			upgradeLevel: weaponCost.upgradeLevel,
			weaponRarity: weaponCost.weaponRarity,
		});
		if (existed) {
			this.logger.log(
				`Weapon cost for upgrade level "${weaponCost.upgradeLevel}" and rarity "${weaponCost.weaponRarity}" already exists. Skipping...`,
			);
			return;
		}
		await this.weaponCostRepo.insert(weaponCost);
		this.logger.log(
			`Weapon cost for upgrade level "${weaponCost.upgradeLevel}" and rarity "${weaponCost.weaponRarity}" seeded successfully.`,
		);
	}

	@Transactional()
	async seed() {
		this.logger.log("Seeding weapon costs...");

		await Promise.all(
			weaponCostsRawData.map((item) => this.handleSingleCost(item)),
		);

		this.logger.log("Weapon costs seeded successfully.");
	}
}
