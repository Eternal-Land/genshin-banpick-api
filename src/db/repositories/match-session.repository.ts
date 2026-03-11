import { MatchSessionEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class MatchSessionRepository extends Repository<MatchSessionEntity> {
	constructor(datasource: DataSource) {
		super(MatchSessionEntity, datasource.createEntityManager());
	}
}
