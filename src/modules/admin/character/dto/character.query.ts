import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery } from "@utils";
import { CharacterElement, WeaponType } from "@utils/enums";
import { Transform } from "class-transformer";
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
	@Transform(({ value }) =>
		value != undefined
			? Array.isArray(value)
				? value.map((v) => Number(v))
				: [Number(value)]
			: [],
	)
	element?: CharacterElement[];

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
	weaponType?: WeaponType[];

	@ApiProperty({
		required: false,
		type: [Number],
		description: "Filter by rarity (4 or 5)",
	})
	@IsNumber({}, { each: true })
	@IsOptional()
	@Transform(({ value }) =>
		value != undefined
			? Array.isArray(value)
				? value.map((v) => Number(v))
				: [Number(value)]
			: [],
	)
	rarity?: number[];

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
