import { ApiProperty } from "@nestjs/swagger";
import { PlayerSide, WeaponRarity } from "@utils/enums";
import { IsOptional } from "class-validator";

export class SessionCostRequest {
	@ApiProperty()
	@IsOptional()
	characterId?: number;

	@ApiProperty()
	@IsOptional()
	activatedConstellation?: number;

	@ApiProperty()
	@IsOptional()
	characterLevel?: number;

	@ApiProperty()
	@IsOptional()
	weaponId?: number;

	@ApiProperty()
	@IsOptional()
	weaponRefinement?: number;

	@ApiProperty()
	@IsOptional()
	weaponRarity?: WeaponRarity;

	@ApiProperty()
	side: PlayerSide;

	@ApiProperty()
	@IsOptional()
	currentTurn: number;
}
