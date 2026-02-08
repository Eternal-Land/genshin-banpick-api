import { ApiProperty } from "@nestjs/swagger";
import { TransformToBoolean, TransformToNumberArray } from "@utils";
import { CharacterElement } from "@utils/enums";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
} from "class-validator";

export class CharacterCostQuery {
	@ApiProperty({ type: Boolean, required: false })
	@IsBoolean()
	@IsOptional()
	@TransformToBoolean()
	showInactive?: boolean;

	@ApiProperty({ type: Number, required: false })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	startId?: number;

	@ApiProperty({ type: Number, required: false, example: 20 })
	@Min(1)
	@Max(50)
	@IsNumber()
	@Type(() => Number)
	limit: number;

	@ApiProperty({
		type: Number,
		enum: CharacterElement,
		isArray: true,
		required: false,
	})
	@IsEnum(CharacterElement, { each: true })
	@IsOptional()
	@TransformToNumberArray()
	element?: CharacterElement[];

	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	search?: string;
}
