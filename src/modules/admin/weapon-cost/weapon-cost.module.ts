import { Module } from "@nestjs/common";
import { WeaponCostService } from "./weapon-cost.service";
import { WeaponCostController } from "./weapon-cost.controller";

@Module({
	providers: [WeaponCostService],
	controllers: [WeaponCostController],
})
export class WeaponCostModule {}
