import { MatchEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class MatchRepository extends Repository<MatchEntity> {
	constructor(datasource: DataSource) {
		super(MatchEntity, datasource.createEntityManager());
	}
}
