import { CharacterEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { CharacterElement, WeaponType } from "@utils/enums";
import { Builder } from "builder-pattern";
import { ProfileResponse } from "@modules/self/dto";

export class CharacterResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	key: string;

	@ApiProperty()
	name: string;

	@ApiProperty({ enum: CharacterElement })
	element: CharacterElement;

	@ApiProperty({ enum: WeaponType })
	weaponType: WeaponType;

	@ApiProperty()
	iconUrl: string;

	@ApiProperty()
	rarity: number;

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

	static fromEntity(entity: CharacterEntity) {
		return Builder(CharacterResponse)
			.id(entity.id)
			.key(entity.key)
			.name(entity.name)
			.element(entity.element)
			.weaponType(entity.weaponType)
			.iconUrl(entity.iconUrl)
			.rarity(entity.rarity)
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

	static fromEntities(entities: CharacterEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
