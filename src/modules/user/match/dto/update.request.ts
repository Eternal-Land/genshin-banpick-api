import { ApiProperty } from "@nestjs/swagger";
import {
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from "class-validator";

export class UpdateMatchRequest {
	@ApiProperty({ type: Number, example: 1, required: false })
	@IsNumber()
	@Min(1)
	@Max(5)
	sessionCount: number;

	@ApiProperty({ type: String, example: "New Match" })
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	name: string;
}
