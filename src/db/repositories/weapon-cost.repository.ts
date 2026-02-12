import { WeaponCostEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class WeaponCostRepository extends Repository<WeaponCostEntity> {
	constructor(datasource: DataSource) {
		super(WeaponCostEntity, datasource.createEntityManager());
	}
}
