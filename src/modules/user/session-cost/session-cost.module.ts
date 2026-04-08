import { Module } from "@nestjs/common";
import { DbModule } from "@db";
import { UserSessionCostController } from "./session-cost.controller";
import { UserSessionCostService } from "./session-cost.service";

@Module({
	imports: [DbModule],
	controllers: [UserSessionCostController],
	providers: [UserSessionCostService],
	exports: [UserSessionCostService],
})
export class UserSessionCostModule {}
