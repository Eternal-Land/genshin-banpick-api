import { ApiProperty } from "@nestjs/swagger";
import { MatchType } from "@utils/enums";
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsEnum,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from "class-validator";

export class CreateMatchRequest {
	@ApiProperty({ type: Number, example: 1 })
	@IsNumber()
	@Min(1)
	@Max(5)
	sessionCount: number;

	@ApiProperty({ type: String, example: "New Match" })
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	name: string;

	@ApiProperty({ type: Number, example: MatchType.REALTIME, enum: MatchType })
	@IsEnum(MatchType)
	type: MatchType;

	@ApiProperty({ type: String, isArray: true })
	@IsString({ each: true })
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	participants: string[];
}
