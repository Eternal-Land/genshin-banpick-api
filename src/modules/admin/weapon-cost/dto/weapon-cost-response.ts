import { WeaponCostEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { WeaponCostUnit, WeaponRarity } from "@utils/enums";
import { Builder } from "builder-pattern";

export class WeaponCostResponseItem {
	@ApiProperty()
	id: number;

	@ApiProperty({ enum: WeaponRarity })
	rarity: WeaponRarity;

	@ApiProperty()
	value: number;

	@ApiProperty()
	unit: WeaponCostUnit;
}

export class WeaponCostResponse {
	@ApiProperty()
	upgradeLevel: number;

	@ApiProperty({ type: WeaponCostResponseItem, isArray: true })
	items: WeaponCostResponseItem[];

	static from(entities: WeaponCostEntity[]) {
		// Group entities by upgradeLevel
		const groupedByLevel = new Map<number, WeaponCostEntity[]>();
		for (const entity of entities) {
			const group = groupedByLevel.get(entity.upgradeLevel) ?? [];
			group.push(entity);
			groupedByLevel.set(entity.upgradeLevel, group);
		}

		// Convert grouped entities to response format
		const response: WeaponCostResponse[] = [];
		for (const [upgradeLevel, levelEntities] of groupedByLevel) {
			const items = levelEntities
				.map((entity) =>
					Builder(WeaponCostResponseItem)
						.id(entity.id)
						.rarity(entity.weaponRarity)
						.value(entity.value)
						.unit(entity.unit)
						.build(),
				)
				.sort((a, b) => b.rarity - a.rarity);

			response.push(
				Builder(WeaponCostResponse)
					.upgradeLevel(upgradeLevel)
					.items(items)
					.build(),
			);
		}

		return response;
	}
}
