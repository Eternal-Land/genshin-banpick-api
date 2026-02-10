import { WeaponCostMilestoneEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { WeaponRarity } from "@utils/enums";
import { Builder } from "builder-pattern";

export class WeaponCostMilestoneResponseItem {
	@ApiProperty()
	id: number;

	@ApiProperty({ enum: WeaponRarity })
	rarity: WeaponRarity;

	@ApiProperty()
	cost: number;

	@ApiProperty()
	addTime: number;
}

export class WeaponCostMilestoneResponse {
	@ApiProperty()
	upgradeLevel: number;

	@ApiProperty({ type: WeaponCostMilestoneResponseItem, isArray: true })
	items: WeaponCostMilestoneResponseItem[];

	static from(entities: WeaponCostMilestoneEntity[]) {
		// Group entities by upgradeLevel
		const groupedByLevel = new Map<number, WeaponCostMilestoneEntity[]>();
		for (const entity of entities) {
			const group = groupedByLevel.get(entity.upgradeLevel) ?? [];
			group.push(entity);
			groupedByLevel.set(entity.upgradeLevel, group);
		}

		// Convert grouped entities to response format
		const response: WeaponCostMilestoneResponse[] = [];
		for (const [upgradeLevel, levelEntities] of groupedByLevel) {
			const items = levelEntities
				.map((entity) =>
					Builder(WeaponCostMilestoneResponseItem)
						.id(entity.id)
						.rarity(entity.weaponRarity)
						.cost(entity.cost)
						.addTime(entity.addTime)
						.build(),
				)
				.sort((a, b) => b.rarity - a.rarity);

			response.push(
				Builder(WeaponCostMilestoneResponse)
					.upgradeLevel(upgradeLevel)
					.items(items)
					.build(),
			);
		}

		return response;
	}
}
