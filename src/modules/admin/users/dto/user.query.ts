import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery } from "@utils";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class UserQuery extends PaginationQuery {
	@ApiProperty({ required: false })
	search?: string;

	@ApiProperty({ required: false, type: [Boolean] })
	@IsBoolean({ each: true })
	@IsOptional()
	@Transform(({ value }) =>
		value != undefined
			? Array.isArray(value)
				? value.map((v) => String(v) == "true")
				: [String(value) == "true"]
			: [],
	)
	isActive?: boolean[];
}
