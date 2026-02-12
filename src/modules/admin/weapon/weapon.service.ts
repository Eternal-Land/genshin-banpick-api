import { WeaponRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { GenshinBanpickCls } from "@utils";
import { CreateWeaponRequest, UpdateWeaponRequest, WeaponQuery } from "./dto";
import { WeaponKeyAlreadyExistsError, WeaponNotFoundError } from "./errors";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class WeaponService {
	constructor(
		private readonly weaponRepo: WeaponRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
	) {}

	async listWeapons(query: WeaponQuery) {
		const { search, type, rarity, showInactive } = query;

		const queryBuilder = this.weaponRepo
			.createQueryBuilder("weapon")
			.leftJoinAndSelect("weapon.createdBy", "createdBy")
			.leftJoinAndSelect("weapon.updatedBy", "updatedBy");

		if (search) {
			queryBuilder.andWhere(
				"(weapon.name LIKE :search OR weapon.key LIKE :search)",
				{ search: `%${search}%` },
			);
		}

		if (type?.length) {
			queryBuilder.andWhere("weapon.type IN (:...type)", { type });
		}

		if (rarity?.length) {
			queryBuilder.andWhere("weapon.rarity IN (:...rarity)", { rarity });
		}

		if (!showInactive) {
			queryBuilder.andWhere("weapon.isActive = :isActive", { isActive: true });
		}

		const [weapons, total] = await Promise.all([
			queryBuilder
				.orderBy("weapon.createdAt", "DESC")
				.skip((query.page - 1) * query.take)
				.take(query.take)
				.getMany(),
			queryBuilder.getCount(),
		]);

		return { weapons, total };
	}

	async getWeapon(id: number) {
		const weapon = await this.weaponRepo.findOne({
			where: { id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
		if (!weapon) {
			throw new WeaponNotFoundError();
		}
		return weapon;
	}

	@Transactional()
	async createWeapon(dto: CreateWeaponRequest) {
		const existing = await this.weaponRepo.findOne({
			where: { key: dto.key },
		});
		if (existing) {
			throw new WeaponKeyAlreadyExistsError();
		}

		const currentAccountId = this.cls.get("profile.id");

		const weapon = this.weaponRepo.create({
			key: dto.key,
			name: dto.name,
			type: dto.type,
			rarity: dto.rarity,
			iconUrl: dto.iconUrl,
			createdById: currentAccountId,
		});

		const saved = await this.weaponRepo.save(weapon);

		return this.weaponRepo.findOne({
			where: { id: saved.id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
	}

	@Transactional()
	async updateWeapon(id: number, dto: UpdateWeaponRequest) {
		const weapon = await this.weaponRepo.findOne({
			where: { id },
		});
		if (!weapon) {
			throw new WeaponNotFoundError();
		}

		if (dto.key !== undefined && dto.key !== weapon.key) {
			const existing = await this.weaponRepo.findOne({
				where: { key: dto.key },
			});
			if (existing && existing.id !== weapon.id) {
				throw new WeaponKeyAlreadyExistsError();
			}
			weapon.key = dto.key;
		}

		if (dto.name !== undefined) {
			weapon.name = dto.name;
		}

		if (dto.type !== undefined) {
			weapon.type = dto.type;
		}

		if (dto.rarity !== undefined) {
			weapon.rarity = dto.rarity;
		}

		if (dto.iconUrl !== undefined) {
			weapon.iconUrl = dto.iconUrl;
		}

		weapon.updatedById = this.cls.get("profile.id");

		await this.weaponRepo.save(weapon);

		return this.weaponRepo.findOne({
			where: { id: weapon.id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
	}

	@Transactional()
	async toggleActive(id: number) {
		const weapon = await this.weaponRepo.findOne({
			where: { id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
		if (!weapon) {
			throw new WeaponNotFoundError();
		}

		weapon.isActive = !weapon.isActive;
		weapon.updatedById = this.cls.get("profile.id");
		await this.weaponRepo.save(weapon);

		return this.weaponRepo.findOne({
			where: { id: weapon.id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
	}
}
