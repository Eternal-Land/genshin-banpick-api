import { WeaponRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserWeaponService {
	constructor(private readonly weaponRepo: WeaponRepository) {}

	async listWeapons() {
		return this.weaponRepo.find({
			where: { isActive: true },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
			order: {
				rarity: "DESC",
				name: "ASC",
			},
		});
	}
}
