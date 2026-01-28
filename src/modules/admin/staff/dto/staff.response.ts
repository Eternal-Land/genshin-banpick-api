import { AccountEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";
import { AccountRole } from "@utils/enums";
import { ProfileResponse } from "@modules/self/dto";

export class StaffResponse {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty({ required: false })
	avatar?: string;

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
	createdBy?: ProfileResponse;

	@ApiProperty({ required: false })
	lastLoginAt?: Date;

	@ApiProperty()
	isActive: boolean;

	static fromEntity(entity: AccountEntity) {
		return Builder(StaffResponse)
			.id(entity.id)
			.avatar(entity.avatar)
			.email(entity.email)
			.ingameUuid(entity.ingameUuid)
			.displayName(entity.displayName)
			.role(entity.role)
			.staffRoleId(entity.staffRoleId)
			.staffRoleName(entity.staffRole?.name)
			.createdAt(entity.createdAt)
			.createdBy(
				entity.createdBy
					? ProfileResponse.fromEntity(entity.createdBy)
					: undefined,
			)
			.lastLoginAt(entity.lastLoginAt)
			.isActive(entity.isActive)
			.build();
	}

	static fromEntities(entities: AccountEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
