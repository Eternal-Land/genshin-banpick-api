import { MatchStateEntity } from "@db/entities";
import { Builder } from "builder-pattern";

export class MatchStateResponse {
	hostJoined: boolean;
	redPlayerJoined: boolean;
	bluePlayerJoined: boolean;

	static fromEntity(entity: MatchStateEntity): MatchStateResponse {
		return Builder(MatchStateResponse)
			.hostJoined(entity.hostJoined)
			.redPlayerJoined(entity.redPlayerJoined)
			.bluePlayerJoined(entity.bluePlayerJoined)
			.build();
	}
}
