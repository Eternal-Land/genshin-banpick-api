import { WeaponEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class WeaponRepository extends Repository<WeaponEntity> {
	constructor(datasource: DataSource) {
		super(WeaponEntity, datasource.createEntityManager());
	}
}
