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

export class CreateCharacterRequest {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	key: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ enum: CharacterElement })
	@IsEnum(CharacterElement)
	element: CharacterElement;

	@ApiProperty({ enum: WeaponType })
	@IsEnum(WeaponType)
	weaponType: WeaponType;

	@ApiProperty()
	@IsUrl()
	@IsOptional()
	iconUrl?: string;

	@ApiProperty()
	@IsInt()
	rarity: number;
}
