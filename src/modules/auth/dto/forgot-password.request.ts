import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsStrongPassword,
	MaxLength,
} from "class-validator";

export class ForgotPasswordRequest {
	@ApiProperty({ example: "800123456" })
	@IsString()
	@IsNotEmpty()
	ingameUuid: string;

	@ApiProperty({ example: "user@example.com" })
	@IsEmail()
	email: string;

	@ApiProperty({ example: "P@ssw0rd1" })
	@IsStrongPassword({
		minLength: 6,
		minLowercase: 1,
		minUppercase: 0,
		minNumbers: 1,
		minSymbols: 0,
	})
	@MaxLength(30)
	password: string;
}
