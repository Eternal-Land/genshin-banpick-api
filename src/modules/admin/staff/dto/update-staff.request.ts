import { ApiProperty } from "@nestjs/swagger";
import {
	IsBoolean,
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsStrongPassword,
	IsUrl,
} from "class-validator";

export class UpdateStaffRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	ingameUuid?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUrl()
	avatar?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	displayName?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	staffRoleId?: number;
}
