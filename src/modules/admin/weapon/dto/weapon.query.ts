import { ApiProperty } from "@nestjs/swagger";
import {
	PaginationQuery,
	TransformToBoolean,
	TransformToNumberArray,
} from "@utils";
import { WeaponRarity, WeaponType } from "@utils/enums";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";

export class WeaponQuery extends PaginationQuery {
	@ApiProperty({ required: false })
	search?: string;

	@ApiProperty({
		required: false,
		enum: WeaponType,
		isArray: true,
		description: "Filter by weapon type",
	})
	@IsEnum(WeaponType, { each: true })
	@IsOptional()
	@TransformToNumberArray()
	type?: WeaponType[];

	@ApiProperty({
		required: false,
		enum: WeaponRarity,
		isArray: true,
		description: "Filter by rarity",
	})
	@IsEnum(WeaponRarity, { each: true })
	@IsOptional()
	@TransformToNumberArray()
	rarity?: WeaponRarity[];

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
