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
import { UserModule } from "@modules/admin/users";
import { CostMilestoneModule } from "@modules/admin/cost-milestone";
import { CharacterCostModule } from "@modules/admin/character-cost";
import { AccountCharacterModule } from "@modules/account-character";
import { UserCharacterModule } from "@modules/user/character";

@Module({
	imports: [
		DbModule,
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
			},
		}),
		PermissionModule,
		CharacterModule,
		StaffRoleModule,
		AuthModule,
		StaffModule,
		FilesModule,
		SelfModule,
		HoyolabModule,
		WeaponModule,
		UserModule,
		CostMilestoneModule,
		CharacterCostModule,
		AccountCharacterModule,
		UserCharacterModule,
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
