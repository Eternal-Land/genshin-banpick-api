import { WeaponEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { WeaponRarity, WeaponType } from "@utils/enums";
import { Builder } from "builder-pattern";
import { ProfileResponse } from "@modules/self/dto";

export class WeaponResponse {
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

	@ApiProperty({ required: false })
	iconUrl?: string;

	@ApiProperty()
	isActive: boolean;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty({ required: false })
	createdBy?: ProfileResponse;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty({ required: false })
	updatedBy?: ProfileResponse;

	static fromEntity(entity: WeaponEntity) {
		return Builder(WeaponResponse)
			.id(entity.id)
			.key(entity.key)
			.name(entity.name)
			.type(entity.type)
			.rarity(entity.rarity)
			.iconUrl(entity.iconUrl)
			.isActive(entity.isActive)
			.createdAt(entity.createdAt)
			.createdBy(
				entity.createdBy
					? ProfileResponse.fromEntity(entity.createdBy)
					: undefined,
			)
			.updatedAt(entity.updatedAt)
			.updatedBy(
				entity.updatedBy
					? ProfileResponse.fromEntity(entity.updatedBy)
					: undefined,
			)
			.build();
	}

	static fromEntities(entities: WeaponEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
