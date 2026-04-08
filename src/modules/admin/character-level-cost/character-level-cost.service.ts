import { CharacterLevelCostRepository } from "@db/repositories/character-level-cost.repository";
import { Injectable } from "@nestjs/common";
import { GenshinBanpickCls } from "@utils";
import { ClsService } from "nestjs-cls";
import { Transactional } from "typeorm-transactional";
import {
	CharacterLevelCostQuery,
	CreateCharacterLevelCostRequest,
	UpdateCharacterLevelCostRequest,
} from "./dto";
import {
	CharacterLevelCostLevelAlreadyExistsError,
	CharacterLevelCostNotFoundError,
} from "./errors";

@Injectable()
export class CharacterLevelCostService {
	constructor(
		private readonly cls: ClsService<GenshinBanpickCls>,
		private readonly characterLevelCostRepo: CharacterLevelCostRepository,
	) {}

	async listCharacterLevelCosts(query: CharacterLevelCostQuery) {
		const { search, level } = query;
		const queryBuilder = this.characterLevelCostRepo
			.createQueryBuilder("characterLevelCost")
			.leftJoinAndSelect("characterLevelCost.updatedBy", "updatedBy")
			.leftJoinAndSelect("characterLevelCost.character", "character")
			.orderBy("characterLevelCost.characterId", "ASC")
			.addOrderBy("characterLevelCost.level", "ASC");

		if (search) {
			queryBuilder.andWhere(
				"(character.name LIKE :search OR character.key LIKE :search)",
				{ search: `%${search}%` },
			);
		}

		if (level?.length) {
			queryBuilder.andWhere("characterLevelCost.level IN (:...level)", {
				level,
			});
		}

		const [characterLevelCosts, total] = await Promise.all([
			queryBuilder
				.skip((query.page - 1) * query.take)
				.take(query.take)
				.getMany(),
			queryBuilder.getCount(),
		]);

		return { characterLevelCosts, total };
	}

	async getCharacterLevelCost(id: number) {
		const entity = await this.characterLevelCostRepo.findOne({
			where: { id },
			relations: {
				character: true,
				updatedBy: true,
			},
		});
		if (!entity) {
			throw new CharacterLevelCostNotFoundError();
		}
		return entity;
	}

	@Transactional()
	async createCharacterLevelCost(dto: CreateCharacterLevelCostRequest) {
		const existed = await this.characterLevelCostRepo.findOne({
			where: {
				characterId: dto.characterId,
				level: dto.level,
			},
		});
		if (existed) {
			throw new CharacterLevelCostLevelAlreadyExistsError();
		}

		const currentAccountId = this.cls.get("profile.id");
		const entity = this.characterLevelCostRepo.create({
			characterId: dto.characterId,
			level: dto.level,
			cost: dto.cost,
			updatedById: currentAccountId,
		});

		const savedEntity = await this.characterLevelCostRepo.save(entity);
		return await this.getCharacterLevelCost(savedEntity.id);
	}

	@Transactional()
	async updateCharacterLevelCost(
		id: number,
		dto: UpdateCharacterLevelCostRequest,
	) {
		const entity = await this.getCharacterLevelCost(id);
		const targetCharacterId = dto.characterId ?? entity.characterId;
		const targetLevel = dto.level ?? entity.level;

		if (
			targetCharacterId !== entity.characterId ||
			targetLevel !== entity.level
		) {
			const existed = await this.characterLevelCostRepo.findOne({
				where: {
					characterId: targetCharacterId,
					level: targetLevel,
				},
			});
			if (existed && existed.id !== id) {
				throw new CharacterLevelCostLevelAlreadyExistsError();
			}
		}

		if (dto.characterId !== undefined) {
			entity.characterId = dto.characterId;
		}

		if (dto.level !== undefined) {
			entity.level = dto.level;
		}

		if (dto.cost !== undefined) {
			entity.cost = dto.cost;
		}

		entity.updatedById = this.cls.get("profile.id");
		const savedEntity = await this.characterLevelCostRepo.save(entity);
		return await this.getCharacterLevelCost(savedEntity.id);
	}

	@Transactional()
	async deleteCharacterLevelCost(id: number) {
		const entity = await this.getCharacterLevelCost(id);
		await this.characterLevelCostRepo.remove(entity);
		return entity;
	}
}
