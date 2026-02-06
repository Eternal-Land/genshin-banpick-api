import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class UpdateCharacterCostRequest {
	@ApiProperty({ type: Number })
	@IsNumber()
	cost: number;
}
