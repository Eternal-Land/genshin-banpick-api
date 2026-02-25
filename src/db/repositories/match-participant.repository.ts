import { MatchParticipantEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class MatchParticipantRepository extends Repository<MatchParticipantEntity> {
	constructor(datasource: DataSource) {
		super(MatchParticipantEntity, datasource.createEntityManager());
	}
}
