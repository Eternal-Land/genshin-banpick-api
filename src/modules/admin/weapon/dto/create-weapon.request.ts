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

export class CreateWeaponRequest {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	key: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ enum: WeaponType })
	@IsEnum(WeaponType)
	type: WeaponType;

	@ApiProperty()
	@IsInt()
	@Min(1)
	@Max(5)
	rarity: number;

	@ApiProperty({ required: false })
	@IsUrl()
	@IsOptional()
	iconUrl?: string;
}
