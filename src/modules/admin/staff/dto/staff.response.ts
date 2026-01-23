import { AccountEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";
import { AccountRole } from "@utils/enums";

export class StaffResponse {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty({ required: false })
	ingameUuid?: string;

	@ApiProperty()
	displayName: string;

	@ApiProperty({ enum: AccountRole })
	role: AccountRole;

	@ApiProperty()
	staffRoleId: number;

	@ApiProperty({ required: false })
	staffRoleName?: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty({ required: false })
	lastLoginAt?: Date;

	static fromEntity(entity: AccountEntity) {
		return Builder(StaffResponse)
			.id(entity.id)
			.email(entity.email)
			.ingameUuid(entity.ingameUuid)
			.displayName(entity.displayName)
			.role(entity.role)
			.staffRoleId(entity.staffRoleId)
			.staffRoleName(entity.staffRole?.name)
			.createdAt(entity.createdAt)
			.lastLoginAt(entity.lastLoginAt)
			.build();
	}

	static fromEntities(entities: AccountEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
