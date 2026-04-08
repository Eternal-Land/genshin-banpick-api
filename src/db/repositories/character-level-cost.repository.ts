import { CharacterLevelCostEntity } from "@db/entities/character-level-cost.entity";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CharacterLevelCostRepository extends Repository<CharacterLevelCostEntity> {
	constructor(datasource: DataSource) {
		super(CharacterLevelCostEntity, datasource.createEntityManager());
	}
}
