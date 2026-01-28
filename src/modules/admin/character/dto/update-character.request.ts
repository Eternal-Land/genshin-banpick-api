import { ApiProperty } from "@nestjs/swagger";
import { CharacterElement, WeaponType } from "@utils/enums";
import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
} from "class-validator";

export class UpdateCharacterRequest {
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

	@ApiProperty({ required: false, enum: CharacterElement })
	@IsOptional()
	@IsEnum(CharacterElement)
	element?: CharacterElement;

	@ApiProperty({ required: false, enum: WeaponType })
	@IsOptional()
	@IsEnum(WeaponType)
	weaponType?: WeaponType;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUrl()
	iconUrl?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	rarity?: number;
}
