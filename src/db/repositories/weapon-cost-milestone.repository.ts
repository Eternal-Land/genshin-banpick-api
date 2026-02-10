import { WeaponCostMilestoneEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class WeaponCostMilestoneRepository extends Repository<WeaponCostMilestoneEntity> {
	constructor(datasource: DataSource) {
		super(WeaponCostMilestoneEntity, datasource.createEntityManager());
	}
}
