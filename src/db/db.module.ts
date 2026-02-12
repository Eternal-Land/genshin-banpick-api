import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { datasource } from "./datasource";
import { addTransactionalDataSource } from "typeorm-transactional";
import {
	AccountRepository,
	CharacterCostRepository,
	CharacterRepository,
	CostMilestoneRepository,
	PermissionRepository,
	StaffRolePermissionRepository,
	StaffRoleRepository,
	WeaponCostRepository,
	WeaponRepository,
	AccountCharacterRepository,
} from "./repositories";

const repositories = [
	PermissionRepository,
	StaffRolePermissionRepository,
	StaffRoleRepository,
	AccountRepository,
	CharacterRepository,
	WeaponRepository,
	CharacterCostRepository,
	CostMilestoneRepository,
	AccountCharacterRepository,
	WeaponCostRepository,
];

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => datasource.options,
			dataSourceFactory: async () => addTransactionalDataSource(datasource),
		}),
	],
	providers: [...repositories],
	exports: [...repositories],
})
export class DbModule {}
