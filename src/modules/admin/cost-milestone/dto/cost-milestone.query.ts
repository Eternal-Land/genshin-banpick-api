import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery, TransformToBoolean } from "@utils";
import { IsBoolean, IsOptional } from "class-validator";

export class CostMilestoneQuery extends PaginationQuery {
	@ApiProperty({
		required: false,
		type: Boolean,
		description: "Filter by active status",
	})
	@IsBoolean()
	@IsOptional()
	@TransformToBoolean()
	showInactive?: boolean;
}
