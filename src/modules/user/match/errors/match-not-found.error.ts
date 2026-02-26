import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class MatchNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.MATCH_NOT_FOUND,
			message: "Match not found",
			status: 404,
		});
	}
}
