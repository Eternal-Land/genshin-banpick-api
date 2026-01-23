import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsStrongPassword,
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
	@IsString()
	@IsNotEmpty()
	displayName?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsStrongPassword({
		minLength: 6,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	password?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	staffRoleId?: number;
}
