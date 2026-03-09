import { ApiProperty } from "@nestjs/swagger";
import { MatchType } from "@utils/enums";
import { IsEnum, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateMatchRequest {
	@ApiProperty({ type: Number, example: 1 })
	@IsNumber()
	@Min(1)
	@Max(5)
	sessionCount: number;

	@ApiProperty({ type: Number, example: MatchType.REALTIME, enum: MatchType })
	@IsEnum(MatchType)
	type: MatchType;

	@ApiProperty({ type: String })
	@IsString()
	redPlayerId: string;

	@ApiProperty({ type: String })
	@IsString()
	bluePlayerId: string;
}
