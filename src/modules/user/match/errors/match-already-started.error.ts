import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class MatchAlreadyStartedError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.MATCH_ALREADY_STARTED,
			message: "Match has already started",
			status: 400,
		});
	}
}
