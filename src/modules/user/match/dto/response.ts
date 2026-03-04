import { MatchEntity } from "@db/entities";
import { ProfileResponse } from "@modules/self/dto";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";
import { MatchType } from "@utils/enums";

export class MatchResponse {
	@ApiProperty()
	id: string;

	@ApiProperty({ type: String })
	name: string;

	@ApiProperty({ type: ProfileResponse })
	host: ProfileResponse;

	@ApiProperty({ type: Number })
	sessionCount: number;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty({ type: ProfileResponse, isArray: true })
	participants: ProfileResponse[];

	@ApiProperty({ type: Number, example: MatchType.REALTIME, enum: MatchType })
	type: MatchType;

	static fromEntity(entity: MatchEntity) {
		return Builder(MatchResponse)
			.id(entity.id)
			.name(entity.name)
			.host(entity.host ? ProfileResponse.fromEntity(entity.host) : null)
			.sessionCount(entity.sessionCount)
			.createdAt(entity.createdAt)
			.participants(
				entity.participants
					? entity.participants.map((p) =>
							ProfileResponse.fromEntity(p.participant),
						)
					: [],
			)
			.type(entity.type)
			.build();
	}

	static fromEntities(entities: MatchEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
