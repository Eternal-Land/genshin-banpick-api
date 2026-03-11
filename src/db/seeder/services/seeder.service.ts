import { AccountRepository } from "@db/repositories";
import { Injectable, Logger } from "@nestjs/common";
import { Env } from "@utils";
import { store } from "../store";
import { CharacterSeederService } from "./character-seeder.service";
import { WeaponSeederService } from "./weapon-seeder.service";
import { CharacterCostMilestoneSeederService } from "./character-cost-milestone-seeder.service";
import * as bcrypt from "bcryptjs";
import { AccountRole } from "@utils/enums";
import { WeaponCostSeederService } from "./weapon-cost-seeder.service";
import { CharacterCostSeederService } from "./character-cost-seeder.service";

@Injectable()
export class SeederService {
	private readonly logger = new Logger(SeederService.name);
	constructor(
		private readonly accountRepo: AccountRepository,
		private readonly characterSeeder: CharacterSeederService,
		private readonly weaponSeeder: WeaponSeederService,
		private readonly characterCostMilestoneSeeder: CharacterCostMilestoneSeederService,
		private readonly weaponCostSeeder: WeaponCostSeederService,
		private readonly characterCostSeeder: CharacterCostSeederService,
	) {}

	private async findOrCreateAdminAccount() {
		let adminAccount = await this.accountRepo.findOneBy({
			email: Env.ADMIN_EMAIL,
		});
		if (!adminAccount) {
			const hashedPassword = await bcrypt.hash(Env.ADMIN_PASSWORD, 10);
			adminAccount = this.accountRepo.create({
				email: Env.ADMIN_EMAIL,
				displayName: "Administrator",
				password: hashedPassword,
				role: AccountRole.ADMIN,
			});
			adminAccount = await this.accountRepo.save(adminAccount);
		}
		return adminAccount;
	}

	private async initStore() {
		const adminAccount = await this.findOrCreateAdminAccount();
		store.adminAccount = adminAccount;
	}

	async seed() {
		this.logger.log("Initializing seed store...");
		await this.initStore();
		this.logger.log("Seed store initialized.");

		this.logger.log("Seeding database...");
		await Promise.all([
			this.characterSeeder.seed(),
			this.weaponSeeder.seed(),
			this.characterCostMilestoneSeeder.seed(),
			this.weaponCostSeeder.seed(),
			this.characterCostSeeder.seed(),
		]);
		this.logger.log("Database seeded successfully.");
	}
}
