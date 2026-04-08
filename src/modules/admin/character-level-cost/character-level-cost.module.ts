import { Module } from "@nestjs/common";
import { CharacterLevelCostController } from "./character-level-cost.controller";
import { CharacterLevelCostService } from "./character-level-cost.service";

@Module({
	controllers: [CharacterLevelCostController],
	providers: [CharacterLevelCostService],
})
export class CharacterLevelCostModule {}
