import { StaffRoleEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";
import { PermissionResponse } from "@modules/admin/permission/dto";
import { ProfileResponse } from "@modules/self/dto";

export class StaffRoleResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	isActive: boolean;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	createdBy: ProfileResponse;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty()
	updatedBy: ProfileResponse;

	@ApiProperty({ type: [PermissionResponse] })
	permissions: PermissionResponse[];

	static fromEntity(entity: StaffRoleEntity) {
		const permissions = entity.permissions?.map((rp) => rp.permission) ?? [];
		return Builder(StaffRoleResponse)
			.id(entity.id)
			.name(entity.name)
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
			.permissions(PermissionResponse.fromEntities(permissions))
			.build();
	}

	static fromEntities(roles: StaffRoleEntity[]) {
		return roles.map((role) => this.fromEntity(role));
	}
}
