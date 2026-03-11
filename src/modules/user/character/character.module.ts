import { Module } from "@nestjs/common";
import { DbModule } from "@db";
import { UserCharacterController } from "./character.controller";
import { UserCharacterService } from "./character.service";

@Module({
	imports: [DbModule],
	controllers: [UserCharacterController],
	providers: [UserCharacterService],
	exports: [UserCharacterService],
})
export class UserCharacterModule {}
