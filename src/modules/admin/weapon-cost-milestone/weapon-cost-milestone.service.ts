import { WeaponCostMilestoneRepository } from "@db/repositories";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { WeaponRarity } from "@utils/enums";
import { Transactional } from "typeorm-transactional";
import { UpdateWeaponCostMilestoneRequest } from "./dto";
import { WeaponCostMilestoneNotFoundError } from "./errors";

@Injectable()
export class WeaponCostMilestoneService implements OnModuleInit {
	constructor(
		private readonly weaponCostMilestoneRepo: WeaponCostMilestoneRepository,
	) {}

	private async handleInitMilestoneItem(
		upgradeLevel: number,
		rarity: WeaponRarity,
	) {
		const existing = await this.weaponCostMilestoneRepo.findOne({
			where: { upgradeLevel, weaponRarity: rarity },
		});
		if (!existing) {
			const milestone = this.weaponCostMilestoneRepo.create({
				upgradeLevel,
				weaponRarity: rarity,
				cost: 0,
				addTime: 0,
			});
			await this.weaponCostMilestoneRepo.save(milestone);
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
	async updateWeaponCostMilestone(
		id: number,
		dto: UpdateWeaponCostMilestoneRequest,
	) {
		const milestone = await this.weaponCostMilestoneRepo.findOne({
			where: { id },
		});
		if (!milestone) {
			throw new WeaponCostMilestoneNotFoundError();
		}
		milestone.cost = dto.cost;
		milestone.addTime = dto.addTime;
		await this.weaponCostMilestoneRepo.save(milestone);
	}

	async listWeaponCostMilestones() {
		return await this.weaponCostMilestoneRepo.find();
	}
}
