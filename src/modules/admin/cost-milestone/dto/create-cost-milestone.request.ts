import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Min } from "class-validator";

export class CreateCostMilestoneRequest {
	@ApiProperty({ description: "Starting cost value for this milestone" })
	@IsNotEmpty()
	@Min(0)
	costFrom: number;

	@ApiProperty({
		required: false,
		description: "Ending cost value for this milestone (null for unlimited)",
	})
	@IsOptional()
	@Min(0)
	costTo?: number;

	@ApiProperty({ description: "Cost value per second for this milestone" })
	@IsNotEmpty()
	@Min(0)
	secPerCost: number;
}
