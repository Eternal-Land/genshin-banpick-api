import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class MatchAlreadyCompletedError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.MATCH_ALREADY_COMPLETED,
			message: "The match has already been completed and cannot be modified.",
		});
	}
}
