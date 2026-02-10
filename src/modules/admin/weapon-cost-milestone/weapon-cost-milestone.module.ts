import { Module } from "@nestjs/common";
import { WeaponCostMilestoneService } from "./weapon-cost-milestone.service";
import { WeaponCostMilestoneController } from "./weapon-cost-milestone.controller";

@Module({
	controllers: [WeaponCostMilestoneController],
	providers: [WeaponCostMilestoneService],
})
export class WeaponCostMilestoneModule {}
