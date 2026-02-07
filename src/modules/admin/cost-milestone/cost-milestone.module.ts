import { Module } from "@nestjs/common";
import { CostMilestoneController } from "./cost-milestone.controller";
import { CostMilestoneService } from "./cost-milestone.service";

@Module({
	providers: [CostMilestoneService],
	exports: [CostMilestoneService],
	controllers: [CostMilestoneController],
})
export class CostMilestoneModule {}
