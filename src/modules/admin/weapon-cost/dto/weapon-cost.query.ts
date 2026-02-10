import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class WeaponCostQuery {
	@ApiProperty({ required: false })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	startId?: number;

	@ApiProperty({ type: Number, required: false, example: 20 })
	@Min(1)
	@Max(50)
	@IsNumber()
	@Type(() => Number)
	limit: number;
}
