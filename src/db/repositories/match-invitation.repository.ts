import { MatchInvitationEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class MatchInvitationRepository extends Repository<MatchInvitationEntity> {
	constructor(datasource: DataSource) {
		super(MatchInvitationEntity, datasource.createEntityManager());
	}
}
