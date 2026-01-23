import { Module } from "@nestjs/common";
import { DbModule } from "@db";
import { PermissionModule } from "@modules/admin/permission";
import { StaffRoleModule } from "@modules/admin/role";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, AuthModule } from "@modules/auth";
import { ClsModule } from "nestjs-cls";
import { StaffModule } from "@modules/admin/staff";

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
		StaffRoleModule,
		AuthModule,
		StaffModule,
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
