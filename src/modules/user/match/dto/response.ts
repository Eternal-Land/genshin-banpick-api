import { MatchEntity } from "@db/entities";
import { ProfileResponse } from "@modules/self/dto";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";
import { MatchStatus, MatchType } from "@utils/enums";

export class MatchResponse {
	@ApiProperty()
	id: string;

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

	@ApiProperty({
		type: Number,
		example: MatchStatus.WAITING,
		enum: MatchStatus,
	})
	status: MatchStatus;

	static fromEntity(entity: MatchEntity) {
		return Builder(MatchResponse)
			.id(entity.id)
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
			.status(entity.status)
			.build();
	}

	static fromEntities(entities: MatchEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
