import { WeaponCostEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";

export class WeaponCostResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	cost: number;

	@ApiProperty()
	addTime: number;

	@ApiProperty()
	upgradeLevel: number;

	static fromEntity(entity: WeaponCostEntity) {
		return Builder(WeaponCostResponse)
			.id(entity.id)
			.cost(entity.cost)
			.addTime(entity.addTime)
			.upgradeLevel(entity.upgradeLevel)
			.build();
	}

	static fromEntities(entities: WeaponCostEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
