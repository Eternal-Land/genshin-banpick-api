import { Module } from "@nestjs/common";
import { DbModule } from "@db";
import { UserWeaponController } from "./weapon.controller";
import { UserWeaponService } from "./weapon.service";

@Module({
	imports: [DbModule],
	controllers: [UserWeaponController],
	providers: [UserWeaponService],
	exports: [UserWeaponService],
})
export class UserWeaponModule {}
