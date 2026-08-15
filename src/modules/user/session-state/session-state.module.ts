import { Module } from "@nestjs/common";
import { DbModule } from "@db";
import { UserSessionStateController } from "./session-state.controller";
import { UserSessionStateService } from "./session-state.service";

@Module({
	imports: [DbModule],
	controllers: [UserSessionStateController],
	providers: [UserSessionStateService],
	exports: [UserSessionStateService],
})
export class UserSessionStateModule {}
