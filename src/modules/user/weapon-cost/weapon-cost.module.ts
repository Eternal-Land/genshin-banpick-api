import { DbModule } from "@db";
import { Module } from "@nestjs/common";
import { UserWeaponCostController } from "./weapon-cost.controller";
import { UserWeaponCostService } from "./weapon-cost.service";

@Module({
	imports: [DbModule],
	controllers: [UserWeaponCostController],
	providers: [UserWeaponCostService],
	exports: [UserWeaponCostService],
})
export class UserWeaponCostModule {}
