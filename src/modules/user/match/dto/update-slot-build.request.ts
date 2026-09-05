import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, Min } from "class-validator";

export class UpdateSlotBuildRequest {
	@ApiProperty()
	@IsInt()
	@Min(1)
	teamOrder: number;

	@ApiProperty()
	@IsInt()
	@Min(1)
	characterId: number;

	@ApiProperty()
	@IsInt()
	@Min(0)
	characterConstellation: number;

	@ApiProperty()
	@IsNumber()
	@Min(0)
	weaponRefinement: number;

	@ApiProperty()
	@IsInt()
	@Min(0)
	characterLevel: number;
}
