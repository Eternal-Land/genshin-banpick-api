import { Module } from "@nestjs/common";
import { HoyolabController } from "./hoyolab.controller";
import { HoyolabService } from "./hoyolab.service";

@Module({
	providers: [HoyolabService],
	controllers: [HoyolabController],
	exports: [HoyolabService],
})
export class HoyolabModule {}
