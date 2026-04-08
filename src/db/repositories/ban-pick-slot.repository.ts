import { BanPickSlotEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class BanPickSlotRepository extends Repository<BanPickSlotEntity> {
	constructor(datasource: DataSource) {
		super(BanPickSlotEntity, datasource.createEntityManager());
	}
}
