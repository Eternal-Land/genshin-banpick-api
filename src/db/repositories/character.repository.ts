import { CharacterEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CharacterRepository extends Repository<CharacterEntity> {
	constructor(datasource: DataSource) {
		super(CharacterEntity, datasource.createEntityManager());
	}
}
