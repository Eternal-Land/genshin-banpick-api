import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class UpdateWeaponCostRequest {
	@ApiProperty()
	@IsNumber()
	cost: number;

	@ApiProperty()
	@IsNumber()
	addTime: number;
}
