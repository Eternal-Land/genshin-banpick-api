import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CharacterCostQuery {
	@ApiProperty({ type: Boolean, required: false })
	@IsBoolean()
	@IsOptional()
	@Type(() => Boolean)
	showInactive?: boolean;

	@ApiProperty({ type: Number, required: false })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	startId?: number;
}
