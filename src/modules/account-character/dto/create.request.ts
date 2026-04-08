import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateAccountCharacterRequest {
	@ApiProperty()
	@IsInt()
	characterId: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	@Min(0)
	@Max(6)
	activatedConstellation?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	@Min(0)
	characterLevel?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	notes?: string;
}
