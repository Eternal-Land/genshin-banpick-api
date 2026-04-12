import { WeaponCostRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserWeaponCostService {
	constructor(private readonly weaponCostRepo: WeaponCostRepository) {}

	async listWeaponCosts() {
		return this.weaponCostRepo.find({
			order: {
				weaponRarity: "DESC",
				upgradeLevel: "ASC",
			},
		});
	}
}
