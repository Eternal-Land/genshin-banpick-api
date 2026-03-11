import {
	AccountCharacterRepository,
	CharacterCostRepository,
	CharacterRepository,
} from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { GenshinBanpickCls } from "@utils";
import { In } from "typeorm";
import {
	AccountCharacterQuery,
	CreateAccountCharacterRequest,
	UpdateAccountCharacterRequest,
} from "./dto";
import {
	AccountCharacterAlreadyExistsError,
	AccountCharacterNotFoundError,
	CharacterNotFoundError,
} from "./errors";

@Injectable()
export class AccountCharacterService {
	constructor(
		private readonly accountCharacterRepo: AccountCharacterRepository,
		private readonly characterCostRepo: CharacterCostRepository,
		private readonly characterRepo: CharacterRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
	) {}

	async createOne(dto: CreateAccountCharacterRequest) {
		const accountId = this.cls.get("profile.id");
		if (!accountId) {
			throw new Error("No profile ID found in CLS context.");
		}

		const character = await this.characterRepo.findOne({
			where: { id: dto.characterId, isActive: true },
		});
		if (!character) {
			throw new CharacterNotFoundError();
		}

		const existing = await this.accountCharacterRepo.findOne({
			where: { accountId, characterId: dto.characterId },
		});
		if (existing) {
			throw new AccountCharacterAlreadyExistsError();
		}

		const accountCharacter = this.accountCharacterRepo.create({
			accountId,
			characterId: dto.characterId,
			activatedConstellation: dto.activatedConstellation,
			characterLevel: dto.characterLevel,
			isOwned: dto.isOwned,
			notes: dto.notes,
		});

		const saved = await this.accountCharacterRepo.save(accountCharacter);
		return this.accountCharacterRepo.findOne({
			where: { id: saved.id, accountId },
			relations: {
				character: true,
			},
		});
	}

	async updateOne(id: string, dto: UpdateAccountCharacterRequest) {
		const accountId = this.cls.get("profile.id");
		if (!accountId) {
			throw new Error("No profile ID found in CLS context.");
		}

		const accountCharacter = await this.accountCharacterRepo.findOne({
			where: { id, accountId },
		});
		if (!accountCharacter) {
			throw new AccountCharacterNotFoundError();
		}

		if (dto.characterId !== undefined) {
			const character = await this.characterRepo.findOne({
				where: { id: dto.characterId, isActive: true },
			});
			if (!character) {
				throw new CharacterNotFoundError();
			}

			const duplicate = await this.accountCharacterRepo.findOne({
				where: { accountId, characterId: dto.characterId },
			});
			if (duplicate && duplicate.id !== accountCharacter.id) {
				throw new AccountCharacterAlreadyExistsError();
			}
			accountCharacter.characterId = dto.characterId;
		}

		if (dto.activatedConstellation !== undefined) {
			accountCharacter.activatedConstellation = dto.activatedConstellation;
		}

		if (dto.characterLevel !== undefined) {
			accountCharacter.characterLevel = dto.characterLevel;
		}

		if (dto.isOwned !== undefined) {
			accountCharacter.isOwned = dto.isOwned;
		}

		if (dto.notes !== undefined) {
			accountCharacter.notes = dto.notes;
		}

		const saved = await this.accountCharacterRepo.save(accountCharacter);
		return this.accountCharacterRepo.findOne({
			where: { id: saved.id, accountId },
			relations: {
				character: true,
			},
		});
	}

	async findMany(query: AccountCharacterQuery) {
		const accountId = this.cls.get("profile.id");
		if (!accountId) {
			throw new Error("No profile ID found in CLS context.");
		}

		const items = await this.accountCharacterRepo.find({
			where: {
				accountId,
				...(query.characterId ? { characterId: query.characterId } : {}),
				...(query.isOwned !== undefined ? { isOwned: query.isOwned } : {}),
			},
			relations: {
				character: true,
			},
			order: {
				character: { rarity: "DESC" },
				characterLevel: "DESC",
			},
			skip: (query.page - 1) * query.take,
			take: query.take,
		});

		const total = await this.accountCharacterRepo.count({
			where: {
				accountId,
				...(query.characterId ? { characterId: query.characterId } : {}),
				...(query.isOwned !== undefined ? { isOwned: query.isOwned } : {}),
			},
		});

		if (!items.length) {
			return { items, total };
		}

		const characterIds = [...new Set(items.map((item) => item.characterId))];
		const constellations = [
			...new Set(items.map((item) => item.activatedConstellation)),
		];

		const characterCosts = await this.characterCostRepo.find({
			where: {
				characterId: In(characterIds),
				constellation: In(constellations),
			},
		});

		const characterCostMap = new Map<string, number>();
		for (const characterCost of characterCosts) {
			characterCostMap.set(
				`${characterCost.characterId}:${characterCost.constellation}`,
				characterCost.cost,
			);
		}

		const accountCharacterWithCost = items.map((item) => ({
			...item,
			characterCost:
				characterCostMap.get(
					`${item.characterId}:${item.activatedConstellation}`,
				) ?? 0,
		}));

		return { items: accountCharacterWithCost, total };
	}

	async findOne(id: string) {
		const accountId = this.cls.get("profile.id");
		if (!accountId) {
			throw new Error("No profile ID found in CLS context.");
		}

		const accountCharacter = await this.accountCharacterRepo.findOne({
			where: { id, accountId },
			relations: {
				character: true,
			},
		});
		if (!accountCharacter) {
			throw new AccountCharacterNotFoundError();
		}
		return accountCharacter;
	}

	async deleteOne(id: string) {
		const accountId = this.cls.get("profile.id");
		if (!accountId) {
			throw new Error("No profile ID found in CLS context.");
		}

		const accountCharacter = await this.accountCharacterRepo.findOne({
			where: { id, accountId },
		});
		if (!accountCharacter) {
			throw new AccountCharacterNotFoundError();
		}

		await this.accountCharacterRepo.remove(accountCharacter);
	}
}
