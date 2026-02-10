import { WeaponRarity, WeaponType } from "@utils/enums";
import { WeaponCostResponse } from "./weapon-cost.response";
import { ApiProperty } from "@nestjs/swagger";
import { WeaponEntity } from "@db/entities";
import { Builder } from "builder-pattern";

export class WeaponCostWeaponResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	key: string;

	@ApiProperty()
	name: string;

	@ApiProperty({ enum: WeaponType })
	type: WeaponType;

	@ApiProperty({ enum: WeaponRarity })
	rarity: WeaponRarity;

	@ApiProperty()
	iconUrl: string;

	@ApiProperty({ type: WeaponCostResponse, isArray: true, required: false })
	weaponCosts?: WeaponCostResponse[];

	static fromEntity(entity: WeaponEntity) {
		const sortedWeaponCosts = entity.weaponCosts?.sort(
			(a, b) => a.upgradeLevel - b.upgradeLevel,
		);

		return Builder(WeaponCostWeaponResponse)
			.id(entity.id)
			.key(entity.key)
			.name(entity.name)
			.type(entity.type)
			.rarity(entity.rarity)
			.iconUrl(entity.iconUrl)
			.weaponCosts(
				entity.weaponCosts
					? WeaponCostResponse.fromEntities(sortedWeaponCosts)
					: undefined,
			)
			.build();
	}

	static fromEntities(entities: WeaponEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
