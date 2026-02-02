import { ApiProperty } from "@nestjs/swagger";
import { WeaponRarity, WeaponType } from "@utils/enums";
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
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

	@ApiProperty({ type: Number, enum: WeaponRarity })
	@IsEnum(WeaponRarity)
	rarity: WeaponRarity;

	@ApiProperty({ required: false })
	@IsUrl()
	@IsOptional()
	iconUrl?: string;
}
