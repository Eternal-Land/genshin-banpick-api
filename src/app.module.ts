import { Module } from "@nestjs/common";
import { DbModule } from "@db";
import { PermissionModule } from "@modules/admin/permission";
import { CharacterModule } from "@modules/admin/character";
import { StaffRoleModule } from "@modules/admin/role";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, AuthModule } from "@modules/auth";
import { ClsModule } from "nestjs-cls";
import { StaffModule } from "@modules/admin/staff";
import { FilesModule } from "@modules/files";
import { SelfModule } from "@modules/self";
import { HoyolabModule } from "@modules/hoyolab";
import { WeaponModule } from "@modules/admin/weapon";
import { UserModule as AdminUserModule } from "@modules/admin/users";
import { CostMilestoneModule } from "@modules/admin/cost-milestone";
import { CharacterCostModule } from "@modules/admin/character-cost";
import { AccountCharacterModule } from "@modules/account-character";
import { UserCharacterModule } from "@modules/user/character";
import { MatchModule } from "@modules/user/match";
import { UserWeaponModule } from "@modules/user/weapon";
import { WeaponCostModule } from "@modules/admin/weapon-cost";
import { UserModule } from "@modules/user/user";
import { SocketModule } from "@modules/socket";
import { NotificationModule } from "@modules/notification";
import { CronModule } from "@modules/cron";
import { UserSessionCostModule } from "@modules/user/session-cost";
import { CharacterLevelCostModule } from "@modules/admin/character-level-cost/character-level-cost.module";
import { UserSessionRecordModule } from "@modules/user/session-record";
import { UserCharacterCostModule } from "@modules/user/character-cost";
import { UserWeaponCostModule } from "@modules/user/weapon-cost";

@Module({
	imports: [
		DbModule,
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
			},
		}),
		AuthModule,
		PermissionModule,
		CharacterModule,
		StaffRoleModule,
		StaffModule,
		FilesModule,
		SelfModule,
		HoyolabModule,
		WeaponModule,
		AdminUserModule,
		CostMilestoneModule,
		CharacterCostModule,
		CharacterLevelCostModule,
		AccountCharacterModule,
		UserCharacterModule,
		MatchModule,
		UserWeaponModule,
		WeaponCostModule,
		UserModule,
		SocketModule,
		NotificationModule,
		CronModule,
		UserSessionCostModule,
		UserSessionRecordModule,
		UserCharacterCostModule,
		UserWeaponCostModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
