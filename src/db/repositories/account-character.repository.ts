import { AccountCharacterEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class AccountCharacterRepository extends Repository<AccountCharacterEntity> {
	constructor(datasource: DataSource) {
		super(AccountCharacterEntity, datasource.createEntityManager());
	}
}
