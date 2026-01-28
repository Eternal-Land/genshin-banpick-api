import { Module } from "@nestjs/common";
import { SelfService } from "./self.service";
import { SelfController } from "./self.controller";

@Module({
	providers: [SelfService],
	controllers: [SelfController],
})
export class SelfModule {}
