import { Module } from "@nestjs/common";
import { DbModule } from "@db";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";

@Module({
	imports: [DbModule],
	controllers: [MatchController],
	providers: [MatchService],
	exports: [MatchService],
})
export class MatchModule {}
