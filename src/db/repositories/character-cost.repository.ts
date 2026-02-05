import { CharacterCostEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CharacterCostRepository extends Repository<CharacterCostEntity> {
	constructor(datasource: DataSource) {
		super(CharacterCostEntity, datasource.createEntityManager());
	}
}
