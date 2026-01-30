import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { datasource } from "./datasource";
import { addTransactionalDataSource } from "typeorm-transactional";
import {
	AccountRepository,
	CharacterRepository,
	PermissionRepository,
	StaffRolePermissionRepository,
	StaffRoleRepository,
} from "./repositories";

const repositories = [
	PermissionRepository,
	StaffRolePermissionRepository,
	StaffRoleRepository,
	AccountRepository,
	CharacterRepository,
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
