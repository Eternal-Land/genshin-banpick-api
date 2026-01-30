import { ApiProperty } from "@nestjs/swagger";
import { WeaponType } from "@utils/enums";
import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Max,
	Min,
} from "class-validator";

export class UpdateWeaponRequest {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	key?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string;

	@ApiProperty({ required: false, enum: WeaponType })
	@IsOptional()
	@IsEnum(WeaponType)
	type?: WeaponType;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(5)
	rarity?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUrl()
	iconUrl?: string;
}
