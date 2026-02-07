import { ApiProperty } from "@nestjs/swagger";
import {
	PaginationQuery,
	TransformToBoolean,
	TransformToNumberArray,
} from "@utils";
import { CharacterElement, WeaponType } from "@utils/enums";
import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";

export class CharacterQuery extends PaginationQuery {
	@ApiProperty({ required: false })
	search?: string;

	@ApiProperty({
		required: false,
		enum: CharacterElement,
		isArray: true,
		description: "Filter by element",
	})
	@IsEnum(CharacterElement, { each: true })
	@IsOptional()
	@TransformToNumberArray()
	element?: CharacterElement[];

	@ApiProperty({
		required: false,
		enum: WeaponType,
		isArray: true,
		description: "Filter by weapon type",
	})
	@IsEnum(WeaponType, { each: true })
	@IsOptional()
	@TransformToNumberArray()
	weaponType?: WeaponType[];

	@ApiProperty({
		required: false,
		type: [Number],
		description: "Filter by rarity (4 or 5)",
	})
	@IsNumber({}, { each: true })
	@IsOptional()
	@TransformToNumberArray()
	rarity?: number[];

	@ApiProperty({
		required: false,
		type: Boolean,
		description: "Filter by active status",
	})
	@IsBoolean()
	@IsOptional()
	@TransformToBoolean()
	showInactive?: boolean;
}
