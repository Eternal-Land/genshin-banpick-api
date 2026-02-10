import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery, TransformToBoolean } from "@utils";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class AccountCharacterQuery extends PaginationQuery {
	@ApiProperty({ required: false, type: Number })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	characterId?: number;

	@ApiProperty({ required: false, type: Boolean })
	@IsOptional()
	@IsBoolean()
	@TransformToBoolean()
	isOwned?: boolean;
}
