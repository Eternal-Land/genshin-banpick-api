import { Module } from "@nestjs/common";
import { DbModule } from "@db/db.module";
import {
	CharacterCostMilestoneSeederService,
	CharacterCostSeederService,
	CharacterSeederService,
	SeederService,
	WeaponCostSeederService,
	WeaponSeederService,
} from "./services";

const services = [
	SeederService,
	CharacterSeederService,
	WeaponSeederService,
	CharacterCostMilestoneSeederService,
	WeaponCostSeederService,
	CharacterCostSeederService,
];

@Module({
	providers: [...services],
	imports: [DbModule],
})
export class SeederModule {}
