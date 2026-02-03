import { AccountEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";

export class UserResponse {
	@ApiProperty()
	id: string;

	@ApiProperty({ required: false })
	ingameUuid?: string;

	@ApiProperty()
	email: string;

	@ApiProperty({ required: false })
	avatar?: string;

	@ApiProperty()
	displayName: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty({ required: false })
	lastLoginAt?: Date;

	@ApiProperty()
	isActive: boolean;

	static fromEntity(entity: AccountEntity) {
		return Builder(UserResponse)
			.id(entity.id)
			.ingameUuid(entity.ingameUuid)
			.email(entity.email)
			.avatar(entity.avatar)
			.displayName(entity.displayName)
			.createdAt(entity.createdAt)
			.lastLoginAt(entity.lastLoginAt)
			.isActive(entity.isActive)
			.build();
	}

	static fromEntities(entities: AccountEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
