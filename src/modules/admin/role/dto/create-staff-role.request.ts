import { ApiProperty } from "@nestjs/swagger";
import {
	ArrayNotEmpty,
	ArrayUnique,
	IsArray,
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";

export class CreateStaffRoleRequest {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ type: [Number] })
	@IsArray()
	@ArrayNotEmpty()
	@ArrayUnique()
	@IsInt({ each: true })
	permissionIds: number[];
}
