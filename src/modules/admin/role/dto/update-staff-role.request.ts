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

export class UpdateStaffRoleRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string;

	@ApiProperty({ required: false, type: [Number] })
	@IsOptional()
	@IsArray()
	@ArrayNotEmpty()
	@ArrayUnique()
	@IsInt({ each: true })
	permissionIds?: number[];
}
