import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery } from "@utils";
import { WeaponRarity, WeaponType } from "@utils/enums";
import { Transform } from "class-transformer";
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
	@Transform(({ value }) =>
		value != undefined
			? Array.isArray(value)
				? value.map((v) => Number(v))
				: [Number(value)]
			: [],
	)
	type?: WeaponType[];

	@ApiProperty({
		required: false,
		enum: WeaponRarity,
		isArray: true,
		description: "Filter by rarity",
	})
	@IsEnum(WeaponRarity, { each: true })
	@IsOptional()
	@Transform(({ value }) =>
		value != undefined
			? Array.isArray(value)
				? value.map((v) => Number(v))
				: [Number(value)]
			: [],
	)
	rarity?: WeaponRarity[];

	@ApiProperty({
		required: false,
		type: [Boolean],
		description: "Filter by active status",
	})
	@IsBoolean({ each: true })
	@IsOptional()
	@Transform(({ value }) =>
		value != undefined
			? Array.isArray(value)
				? value.map((v) => String(v) == "true")
				: [String(value) == "true"]
			: [],
	)
	isActive?: boolean[];
}
