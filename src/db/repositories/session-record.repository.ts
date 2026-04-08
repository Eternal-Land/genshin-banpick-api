import { SessionRecordEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SessionRecordRepository extends Repository<SessionRecordEntity> {
	constructor(datasource: DataSource) {
		super(SessionRecordEntity, datasource.createEntityManager());
	}
}
