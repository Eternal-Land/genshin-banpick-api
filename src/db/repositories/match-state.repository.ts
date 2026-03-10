import { MatchStateEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class MatchStateRepository extends Repository<MatchStateEntity> {
	constructor(datasource: DataSource) {
		super(MatchStateEntity, datasource.createEntityManager());
	}

	async findOneOrCreate(matchId: string) {
		let matchState = await this.findOne({ where: { matchId } });
		if (!matchState) {
			matchState = await this.save(this.create({ matchId }));
		}
		return matchState;
	}
}
