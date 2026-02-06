import { CharacterCostEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";

export class CharacterCostResponse {
	@ApiProperty({ type: Number })
	id: number;

	@ApiProperty({ type: Number })
	constellation: number;

	@ApiProperty({ type: Number })
	cost: number;

	static fromEntity(entity: CharacterCostEntity) {
		return Builder(CharacterCostResponse)
			.id(entity.id)
			.constellation(entity.constellation)
			.cost(entity.cost)
			.build();
	}

	static fromEntities(entities: CharacterCostEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
