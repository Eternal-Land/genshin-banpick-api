import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class SelfProfileNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.SELF_PROFILE_NOT_FOUND,
			message: "Profile not found",
			status: 404,
		});
	}
}
