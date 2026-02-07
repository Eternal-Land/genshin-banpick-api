import { ApiProperty } from "@nestjs/swagger";
import { CharacterCostResponse } from "./character-cost.response";
import { Builder } from "builder-pattern";
import { CharacterEntity } from "@db/entities";

export class CharacterCostCharacterResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	key: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	iconUrl: string;

	@ApiProperty()
	rarity: number;

	@ApiProperty({ type: [CharacterCostResponse], required: false })
	characterCosts?: CharacterCostResponse[];

	static fromEntity(entity: CharacterEntity) {
		const sortedCharacterCost = entity.characterCosts?.sort(
			(a, b) => a.constellation - b.constellation,
		);

		return Builder(CharacterCostCharacterResponse)
			.id(entity.id)
			.key(entity.key)
			.name(entity.name)
			.iconUrl(entity.iconUrl)
			.rarity(entity.rarity)
			.characterCosts(
				sortedCharacterCost
					? CharacterCostResponse.fromEntities(sortedCharacterCost)
					: undefined,
			)
			.build();
	}

	static fromEntities(entities: CharacterEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
