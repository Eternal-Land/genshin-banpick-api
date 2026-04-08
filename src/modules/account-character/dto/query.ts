import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class AccountCharacterQuery {
	@ApiProperty({ required: false, type: Number })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	characterId?: number;

	@ApiProperty({ required: true, type: String })
	@IsString()
	accountId: string;
}
