import { WeaponEntity } from "@db/entities";
import { WeaponRepository } from "@db/repositories";
import { Injectable, Logger } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { store } from "../store";
import { rawWeaps } from "../raw-data/weapon";
import { DeepPartial } from "typeorm";

@Injectable()
export class WeaponSeederService {
	private readonly logger = new Logger(WeaponSeederService.name);
	constructor(private readonly weaponRepo: WeaponRepository) {}

	@Transactional()
	async seed() {
		this.logger.log("Seeding weapons...");

		await Promise.all(rawWeaps.map((weap) => this.seedSingleWeap(weap)));

		this.logger.log("Weapons seeded successfully.");
	}

	private async seedSingleWeap(weapon: DeepPartial<WeaponEntity>) {
		const adminAccount = store.adminAccount!;
		const existed = await this.weaponRepo.findOneBy({ key: weapon.key });
		if (existed) {
			this.logger.log(
				`Weapon with key "${weapon.key}" already exists. Skipping...`,
			);
			return;
		}
		weapon.createdById = adminAccount.id;
		await this.weaponRepo.save(weapon);
		this.logger.log(`Weapon with key "${weapon.key}" seeded successfully.`);
	}
}
