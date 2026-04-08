import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery, TransformToNumberArray } from "@utils";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CharacterLevelCostQuery extends PaginationQuery {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	search?: string;

	@ApiProperty({ required: false, type: Number, isArray: true })
	@IsOptional()
	@IsNumber({}, { each: true })
	@TransformToNumberArray()
	level?: number[];
}
