import { MatchStateEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class MatchStateRepository extends Repository<MatchStateEntity> {
	constructor(datasource: DataSource) {
		super(MatchStateEntity, datasource.createEntityManager());
	}
}
