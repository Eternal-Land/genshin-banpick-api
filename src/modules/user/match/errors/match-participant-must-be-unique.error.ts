import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class MatchParticipantMustBeUniqueError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.MATCH_PARTICIPANT_MUST_BE_UNIQUE,
			message: "Participant must be unique",
			status: 400,
		});
	}
}
