import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class PaginationQuery {
	@ApiProperty()
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	page: number;

	@ApiProperty()
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	take: number;
}
