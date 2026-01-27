import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsStrongPassword,
	IsInt,
	IsUrl,
} from "class-validator";

export class CreateStaffRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	ingameUuid?: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUrl()
	avatar?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	displayName: string;

	@ApiProperty()
	@IsStrongPassword({
		minLength: 6,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	password: string;

	@ApiProperty()
	@IsInt()
	staffRoleId: number;
}
