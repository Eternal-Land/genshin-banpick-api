import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateCharacterLevelCostRequest {
	@ApiProperty({ description: "Character id" })
	@IsInt()
	@Min(1)
	characterId: number;

	@ApiProperty({ description: "Character level" })
	@IsInt()
	@Min(1)
	level: number;

	@ApiProperty({ description: "Cost value for this level" })
	@IsNotEmpty()
	@Min(0)
	cost: number;
}
