import { WeaponCostRepository } from "@db/repositories";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { WeaponCostUnit, WeaponRarity } from "@utils/enums";
import { Transactional } from "typeorm-transactional";
import { UpdateWeaponCostRequest } from "./dto";
import { WeaponCostNotFoundError } from "./errors";

@Injectable()
export class WeaponCostService implements OnModuleInit {
	constructor(private readonly weaponCostRepo: WeaponCostRepository) {}

	private async handleInitMilestoneItem(
		upgradeLevel: number,
		rarity: WeaponRarity,
	) {
		const existing = await this.weaponCostRepo.findOne({
			where: { upgradeLevel, weaponRarity: rarity },
		});
		if (!existing) {
			const milestone = this.weaponCostRepo.create({
				upgradeLevel,
				weaponRarity: rarity,
				value: 0,
				unit: WeaponCostUnit.COST,
			});
			await this.weaponCostRepo.save(milestone);
		}
	}

	@Transactional()
	async initMilestones() {
		const promises: Promise<void>[] = [];
		for (let i = 1; i <= 6; i++) {
			for (const key in WeaponRarity) {
				if (!isNaN(Number(key))) continue;
				promises.push(
					this.handleInitMilestoneItem(
						i,
						WeaponRarity[key as keyof typeof WeaponRarity],
					),
				);
			}
		}
		await Promise.all(promises);
	}

	async onModuleInit() {
		await this.initMilestones();
	}

	@Transactional()
	async updateWeaponCost(id: number, dto: UpdateWeaponCostRequest) {
		const weaponCost = await this.weaponCostRepo.findOne({
			where: { id },
		});
		if (!weaponCost) {
			throw new WeaponCostNotFoundError();
		}
		weaponCost.value = dto.value;
		weaponCost.unit = dto.unit;
		await this.weaponCostRepo.save(weaponCost);
	}

	async listWeaponCosts() {
		return await this.weaponCostRepo.find();
	}

	async clearAllWeaponCosts() {
		await this.weaponCostRepo.clear();
	}
}
