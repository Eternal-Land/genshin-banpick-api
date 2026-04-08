import { Module } from "@nestjs/common";
import { DbModule } from "@db";
import { UserSessionRecordController } from "./session-record.controller";
import { UserSessionRecordService } from "./session-record.service";

@Module({
	imports: [DbModule],
	controllers: [UserSessionRecordController],
	providers: [UserSessionRecordService],
	exports: [UserSessionRecordService],
})
export class UserSessionRecordModule {}
