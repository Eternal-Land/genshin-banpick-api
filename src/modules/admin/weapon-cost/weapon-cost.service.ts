import { WeaponCostEntity, WeaponEntity } from "@db/entities";
import {
	WeaponCostMilestoneRepository,
	WeaponCostRepository,
	WeaponRepository,
} from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { UpdateWeaponCostRequest, WeaponCostQuery } from "./dto";
import { Transactional } from "typeorm-transactional";
import { WeaponCostNotFoundError } from "./errors";

@Injectable()
export class WeaponCostService {
	constructor(
		private readonly weaponRepo: WeaponRepository,
		private readonly weaponCostRepo: WeaponCostRepository,
		private readonly weaponCostMilestoneRepo: WeaponCostMilestoneRepository,
	) {}

	@Transactional()
	async syncWithWeapons() {
		const milestones = await this.weaponCostMilestoneRepo.find();
		const milestoneLevelMap = new Map<number, (typeof milestones)[0]>();
		for (const milestone of milestones) {
			milestoneLevelMap.set(milestone.upgradeLevel, milestone);
		}
		const weapons = await this.weaponRepo.find();
		const promises: Promise<void>[] = [];
		for (const weapon of weapons) {
			promises.push(this.handleWeaponCostSync(weapon, milestoneLevelMap));
		}
		await Promise.all(promises);
	}

	private async handleWeaponCostSync(
		weapon: WeaponEntity,
		milestoneLevelMap: Map<number, { cost: number; addTime: number }>,
	) {
		if (!weapon.isActive) {
			await this.weaponCostRepo.delete({ weaponId: weapon.id });
			return;
		}

		const existingCosts = await this.weaponCostRepo.find({
			where: { weaponId: weapon.id },
		});
		const existingLevels = new Set<number>();
		for (const cost of existingCosts) {
			existingLevels.add(cost.upgradeLevel);
		}

		const newCosts: WeaponCostEntity[] = [];
		for (let level = 1; level <= 6; level++) {
			if (existingLevels.has(level)) {
				continue;
			}
			const milestone = milestoneLevelMap.get(level);
			if (!milestone) {
				continue;
			}
			newCosts.push(
				this.weaponCostRepo.create({
					weaponId: weapon.id,
					upgradeLevel: level,
					cost: milestone.cost,
					addTime: milestone.addTime,
				}),
			);
		}

		await this.weaponCostRepo.save(newCosts);
	}

	async listWeaponCosts(query: WeaponCostQuery) {
		const weaponQueryBuilder = this.weaponRepo.createQueryBuilder("weapon");

		if (query.startId) {
			weaponQueryBuilder.andWhere("weapon.id >= :startId", {
				startId: query.startId,
			});
		}

		const weapons = await weaponQueryBuilder
			.innerJoinAndSelect("weapon.weaponCosts", "weaponCosts")
			.take(query.limit + 1)
			.orderBy("weapon.id", "ASC")
			.getMany();

		let next: number | undefined = undefined;
		if (weapons.length > query.limit) {
			const lastWeapon = weapons.pop();
			next = lastWeapon.id;
		}

		return { weapons, next };
	}

	@Transactional()
	async updateWeaponCost(weaponCostId: number, dto: UpdateWeaponCostRequest) {
		const weaponCost = await this.weaponCostRepo.findOne({
			where: { id: weaponCostId },
		});

		if (!weaponCost) {
			throw new WeaponCostNotFoundError();
		}

		weaponCost.cost = dto.cost;
		weaponCost.addTime = dto.addTime;

		await this.weaponCostRepo.save(weaponCost);
	}
}
