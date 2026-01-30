import { CharacterRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { GenshinBanpickCls } from "@utils";
import { CreateCharacterRequest, UpdateCharacterRequest } from "./dto";
import {
	CharacterKeyAlreadyExistsError,
	CharacterNotFoundError,
} from "./errors";

@Injectable()
export class CharacterService {
	constructor(
		private readonly characterRepo: CharacterRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
	) {}

	async listCharacters() {
		return this.characterRepo.find({
			relations: {
				createdBy: true,
				updatedBy: true,
			},
			order: { createdAt: "DESC" },
		});
	}

	async getCharacter(id: number) {
		const character = await this.characterRepo.findOne({
			where: { id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
		if (!character) {
			throw new CharacterNotFoundError();
		}
		return character;
	}

	async createCharacter(dto: CreateCharacterRequest) {
		const existing = await this.characterRepo.findOne({
			where: { key: dto.key },
		});
		if (existing) {
			throw new CharacterKeyAlreadyExistsError();
		}

		const currentAccountId = this.cls.get("profile.id");

		const character = this.characterRepo.create({
			key: dto.key,
			name: dto.name,
			element: dto.element,
			weaponType: dto.weaponType,
			iconUrl: dto.iconUrl,
			rarity: dto.rarity,
			createdById: currentAccountId,
		});

		const saved = await this.characterRepo.save(character);

		return this.characterRepo.findOne({
			where: { id: saved.id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
	}

	async updateCharacter(id: number, dto: UpdateCharacterRequest) {
		const character = await this.characterRepo.findOne({
			where: { id },
		});
		if (!character) {
			throw new CharacterNotFoundError();
		}

		if (dto.key !== undefined && dto.key !== character.key) {
			const existing = await this.characterRepo.findOne({
				where: { key: dto.key },
			});
			if (existing && existing.id !== character.id) {
				throw new CharacterKeyAlreadyExistsError();
			}
			character.key = dto.key;
		}

		if (dto.name !== undefined) {
			character.name = dto.name;
		}

		if (dto.element !== undefined) {
			character.element = dto.element;
		}

		if (dto.weaponType !== undefined) {
			character.weaponType = dto.weaponType;
		}

		if (dto.iconUrl !== undefined) {
			character.iconUrl = dto.iconUrl;
		}

		if (dto.rarity !== undefined) {
			character.rarity = dto.rarity;
		}

		character.updatedById = this.cls.get("profile.id");

		await this.characterRepo.save(character);

		return this.characterRepo.findOne({
			where: { id: character.id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
	}

	async toggleActive(id: number) {
		const character = await this.characterRepo.findOne({
			where: { id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
		if (!character) {
			throw new CharacterNotFoundError();
		}

		character.isActive = !character.isActive;
		character.updatedById = this.cls.get("profile.id");
		await this.characterRepo.save(character);

		return this.characterRepo.findOne({
			where: { id: character.id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
	}
}
