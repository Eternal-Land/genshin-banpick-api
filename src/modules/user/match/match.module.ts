import { Module } from "@nestjs/common";
import { DbModule } from "@db";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { UserSessionCostModule } from "../session-cost";

@Module({
	imports: [DbModule, UserSessionCostModule],
	controllers: [MatchController],
	providers: [MatchService],
	exports: [MatchService],
})
export class MatchModule {}
