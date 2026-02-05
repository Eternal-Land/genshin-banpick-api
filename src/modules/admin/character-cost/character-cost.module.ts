import { Module } from "@nestjs/common";
import { CharacterCostController } from "./character-cost.controller";
import { CharacterCostService } from "./character-cost.service";

@Module({
	providers: [CharacterCostService],
	controllers: [CharacterCostController],
})
export class CharacterCostModule {}
