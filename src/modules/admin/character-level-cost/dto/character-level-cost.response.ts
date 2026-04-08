import { CharacterLevelCostEntity } from "@db/entities/character-level-cost.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";
import { ProfileResponse } from "@modules/self/dto";
import { CharacterResponse } from "@modules/admin/character/dto";

export class CharacterLevelCostResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	characterId: number;

	@ApiProperty()
	level: number;

	@ApiProperty()
	cost: number;

	@ApiProperty({ required: false })
	updatedAt?: Date;

	@ApiProperty({ required: false })
	updatedBy?: ProfileResponse;

	character: CharacterResponse;

	static fromEntity(entity: CharacterLevelCostEntity) {
		return Builder(CharacterLevelCostResponse)
			.id(entity.id)
			.characterId(entity.characterId)
			.level(entity.level)
			.cost(Number(entity.cost))
			.character(
				entity.character
					? CharacterResponse.fromEntity(entity.character)
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

	static fromEntities(entities: CharacterLevelCostEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
