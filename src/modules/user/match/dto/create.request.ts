import { ApiProperty } from "@nestjs/swagger";
import {
	IsBoolean,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from "class-validator";

export class CreateMatchRequest {
	@ApiProperty({ type: Boolean, example: true })
	@IsBoolean()
	isParticipant: boolean;

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
}
