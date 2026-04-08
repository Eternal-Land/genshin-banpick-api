import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";

export class UpdateCharacterLevelCostRequest {
	@ApiProperty({ required: false, description: "Character id" })
	@IsOptional()
	@IsInt()
	@Min(1)
	characterId?: number;

	@ApiProperty({ required: false, description: "Character level" })
	@IsOptional()
	@IsInt()
	@Min(1)
	level?: number;

	@ApiProperty({ required: false, description: "Cost value for this level" })
	@IsOptional()
	@Min(0)
	cost?: number;
}
