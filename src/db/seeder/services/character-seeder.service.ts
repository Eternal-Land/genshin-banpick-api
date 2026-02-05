import { CharacterRepository } from "@db/repositories";
import { Injectable, Logger } from "@nestjs/common";
import { CharacterEntity } from "@db/entities";
import { store } from "../store";
import { Transactional } from "typeorm-transactional";
import { rawChars } from "../raw-data/characters";
import { DeepPartial } from "typeorm";

@Injectable()
export class CharacterSeederService {
	private readonly logger = new Logger(CharacterSeederService.name);
	constructor(private readonly characterRepo: CharacterRepository) {}

	@Transactional()
	async seed() {
		this.logger.log("Seeding characters...");

		await Promise.all(rawChars.map((char) => this.seedSingleChar(char)));

		this.logger.log("Characters seeded successfully.");
	}

	private async seedSingleChar(character: DeepPartial<CharacterEntity>) {
		const adminAccount = store.adminAccount!;
		const existed = await this.characterRepo.findOneBy({ key: character.key });
		if (existed) {
			this.logger.log(
				`Character with key "${character.key}" already exists. Skipping...`,
			);
			return;
		}
		character.createdById = adminAccount.id;
		await this.characterRepo.save(character);
		this.logger.log(
			`Character with key "${character.key}" seeded successfully.`,
		);
	}
}
