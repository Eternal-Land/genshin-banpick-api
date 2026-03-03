import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class MatchParticipantLimitReachedError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.MATCH_PARTICIPANT_LIMIT_REACHED,
			message: "Match already has maximum participants",
			status: 400,
		});
	}
}
