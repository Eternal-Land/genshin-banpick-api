import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class MatchParticipantInLiveMatchError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.MATCH_PARTICIPANT_IN_LIVE_MATCH,
			message: "One or more participants are already in a live match",
			status: 400,
		});
	}
}
