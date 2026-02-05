import { AccountRepository } from "@db/repositories";
import { Injectable, Logger } from "@nestjs/common";
import { Env } from "@utils";
import { store } from "../store";
import { CharacterSeederService } from "./character-seeder.service";
import { WeaponSeederService } from "./weapon-seeder.service";

@Injectable()
export class SeederService {
	private readonly logger = new Logger(SeederService.name);
	constructor(
		private readonly accountRepo: AccountRepository,
		private readonly characterSeeder: CharacterSeederService,
		private readonly weaponSeeder: WeaponSeederService,
	) {}

	async initStore() {
		const adminAccount = await this.accountRepo.findOneBy({
			email: Env.ADMIN_EMAIL,
		});
		if (!adminAccount) {
			throw new Error("Admin account not found.");
		}
		store.adminAccount = adminAccount;
	}

	async seed() {
		this.logger.log("Initializing seed store...");
		await this.initStore();
		this.logger.log("Seed store initialized.");

		this.logger.log("Seeding database...");
		await Promise.all([this.characterSeeder.seed(), this.weaponSeeder.seed()]);
		this.logger.log("Database seeded successfully.");
	}
}
