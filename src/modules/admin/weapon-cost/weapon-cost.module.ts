import { Module } from "@nestjs/common";
import { WeaponCostService } from "./weapon-cost.service";
import { WeaponCostController } from "./weapon-cost.controller";

@Module({
	controllers: [WeaponCostController],
	providers: [WeaponCostService],
})
export class WeaponCostModule {}
