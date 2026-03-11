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
			try {
				await this.insert({ matchId });
			} catch {
				// Another concurrent request may have already created this row.
			}

			matchState = await this.findOne({ where: { matchId } });
			if (!matchState) {
				throw new Error("Failed to initialize match state");
			}
		}
		return matchState;
	}
}
