import { AccountEntity } from "@db/entities";
import { Builder } from "builder-pattern";
import { AccountRole } from "@utils/enums";
import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponse {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	avatar: string;

	@ApiProperty()
	ingameUuid: string;

	@ApiProperty()
	displayName: string;

	@ApiProperty({ enum: AccountRole })
	role: AccountRole;

	@ApiProperty()
	staffRoleName: string;

	@ApiProperty()
	permissions: string[];

	static fromEntity(entity: AccountEntity) {
		return Builder(ProfileResponse)
			.id(entity.id)
			.avatar(entity.avatar)
			.email(entity.email)
			.ingameUuid(entity.ingameUuid)
			.displayName(entity.displayName)
			.role(entity.role)
			.staffRoleName(entity.staffRole?.name)
			.permissions(
				entity.staffRole?.permissions?.map((p) => p.permission.code) || [],
			)
			.build();
	}

	static fromEntities(entities: AccountEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
