import { Module } from "@nestjs/common";
import { AccountCharacterService } from "./account-character.service";
import { AccountCharacterController } from "./account-character.controller";

@Module({
	providers: [AccountCharacterService],
	exports: [AccountCharacterService],
	controllers: [AccountCharacterController],
})
export class AccountCharacterModule {}
