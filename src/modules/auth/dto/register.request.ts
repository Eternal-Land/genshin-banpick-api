import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsStrongPassword,
	IsUrl,
	MaxLength,
} from "class-validator";

export class RegisterRequest {
	@ApiProperty({ example: "123456789" })
	@IsString()
	@IsNotEmpty()
	ingameUuid: string;

	@ApiProperty({ example: "user@example.com" })
	@IsEmail()
	email: string;

	@ApiProperty({ required: false })
	@IsUrl()
	@IsOptional()
	avatar: string;

	@ApiProperty({ example: "User123" })
	@IsString()
	@IsNotEmpty()
	displayName: string;

	@ApiProperty({ example: "P@ssw0rd!" })
	@IsStrongPassword({
		minLength: 6,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	@MaxLength(30)
	password: string;
}
