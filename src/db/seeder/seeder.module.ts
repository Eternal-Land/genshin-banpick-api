import { Module } from "@nestjs/common";
import { DbModule } from "@db/db.module";
import {
	CharacterSeederService,
	SeederService,
	WeaponSeederService,
} from "./services";

const services = [SeederService, CharacterSeederService, WeaponSeederService];

@Module({
	providers: [...services],
	imports: [DbModule],
})
export class SeederModule {}
