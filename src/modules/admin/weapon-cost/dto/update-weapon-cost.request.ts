import { ApiProperty } from "@nestjs/swagger";
import { WeaponCostUnit } from "@utils/enums";
import { IsEnum, IsNumber } from "class-validator";

export class UpdateWeaponCostRequest {
	@ApiProperty()
	@IsNumber()
	value: number;

	@ApiProperty({ enum: WeaponCostUnit })
	@IsEnum(WeaponCostUnit)
	unit: WeaponCostUnit;
}
