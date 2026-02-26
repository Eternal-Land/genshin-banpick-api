import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery } from "@utils";
import { IsOptional, IsString } from "class-validator";

export class MatchQuery extends PaginationQuery {
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	accountId?: string;

	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	search?: string;
}
