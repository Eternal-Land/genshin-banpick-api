import { SessionCostEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SessionCostRepository extends Repository<SessionCostEntity> {
	constructor(datasource: DataSource) {
		super(SessionCostEntity, datasource.createEntityManager());
	}
}
