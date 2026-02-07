import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery, TransformToBooleanArray } from "@utils";
import { IsBoolean, IsOptional } from "class-validator";

export class UserQuery extends PaginationQuery {
	@ApiProperty({ required: false })
	search?: string;

	@ApiProperty({ required: false, type: [Boolean] })
	@IsBoolean({ each: true })
	@IsOptional()
	@TransformToBooleanArray()
	isActive?: boolean[];
}
