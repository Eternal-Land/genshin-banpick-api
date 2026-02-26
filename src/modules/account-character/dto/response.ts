import { AccountCharacterEntity } from "@db/entities";
import { CharacterResponse } from "@modules/admin/character/dto";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";

export class AccountCharacterResponse {
	@ApiProperty()
	id: string;

	@ApiProperty()
	accountId: string;

	@ApiProperty()
	characterId: number;

	@ApiProperty()
	activatedConstellation: number;

	@ApiProperty()
	characterLevel: number;

	@ApiProperty()
	isOwned: boolean;

	@ApiProperty({ required: false })
	notes?: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty()
	characters: CharacterResponse;

	static fromEntity(entity: AccountCharacterEntity) {
		return Builder(AccountCharacterResponse)
			.id(entity.id)
			.accountId(entity.accountId)
			.characterId(entity.characterId)
			.characters(CharacterResponse.fromEntity(entity.character))
			.activatedConstellation(entity.activatedConstellation)
			.characterLevel(entity.characterLevel)
			.isOwned(entity.isOwned)
			.notes(entity.notes)
			.createdAt(entity.createdAt)
			.updatedAt(entity.updatedAt)
			.build();
	}

	static fromEntities(entities: AccountCharacterEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
