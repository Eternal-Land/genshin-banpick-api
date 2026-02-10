import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class UpdateWeaponCostMilestoneRequest {
	@ApiProperty()
	@IsNumber()
	cost: number;

	@ApiProperty()
	@IsNumber()
	addTime: number;
}
