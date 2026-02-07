import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";

export class UpdateCostMilestoneRequest {
	@ApiProperty({
		required: false,
		description: "Starting cost value for this milestone",
	})
	@IsOptional()
	@Min(0)
	costFrom?: number;

	@ApiProperty({
		required: false,
		description: "Ending cost value for this milestone (null for unlimited)",
	})
	@IsOptional()
	@Min(0)
	costTo?: number;

	@ApiProperty({
		required: false,
		description: "Cost value per second for this milestone",
	})
	@IsOptional()
	@Min(0)
	costValuePerSec?: number;
}
