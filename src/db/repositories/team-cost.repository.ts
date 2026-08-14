import { TeamCostEntity } from "@db/entities/team-cost.entity";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class TeamCostRepository extends Repository<TeamCostEntity> {
	constructor(datasource: DataSource) {
		super(TeamCostEntity, datasource.createEntityManager());
	}
}
