import { DbModule } from "@db";
import { Module } from "@nestjs/common";
import { UserCharacterCostController } from "./character-cost.controller";
import { UserCharacterCostService } from "./character-cost.service";

@Module({
	imports: [DbModule],
	controllers: [UserCharacterCostController],
	providers: [UserCharacterCostService],
	exports: [UserCharacterCostService],
})
export class UserCharacterCostModule {}
