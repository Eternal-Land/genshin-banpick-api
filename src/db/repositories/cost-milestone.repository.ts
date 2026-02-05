import { CostMilestoneEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CostMilestoneRepository extends Repository<CostMilestoneEntity> {
	constructor(datasource: DataSource) {
		super(CostMilestoneEntity, datasource.createEntityManager());
	}
}
