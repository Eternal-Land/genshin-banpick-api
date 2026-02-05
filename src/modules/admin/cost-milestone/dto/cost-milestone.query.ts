import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery } from "@utils";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class CostMilestoneQuery extends PaginationQuery {
	@ApiProperty({
		required: false,
		type: [Boolean],
		description: "Filter by active status",
	})
	@IsBoolean({ each: true })
	@IsOptional()
	@Transform(({ value }) =>
		value != undefined
			? Array.isArray(value)
				? value.map((v) => v === "true" || v === true)
				: [value === "true" || value === true]
			: [],
	)
	isActive?: boolean[];
}
