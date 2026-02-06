import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class PaginationQuery {
	@ApiProperty({ example: 1 })
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	page: number;

	@ApiProperty({ example: 10 })
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	take: number;
}
