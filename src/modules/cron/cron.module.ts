import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	providers: [CronService],
	imports: [ScheduleModule.forRoot()],
})
export class CronModule {}
