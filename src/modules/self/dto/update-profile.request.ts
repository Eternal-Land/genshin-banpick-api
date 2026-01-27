import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
} from "class-validator";

export class UpdateProfileRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	ingameUuid?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUrl()
	avatar?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	displayName?: string;
}
