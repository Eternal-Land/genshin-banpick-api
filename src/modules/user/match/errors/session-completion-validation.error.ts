import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class SessionCompletionValidationError extends ApiError {
	constructor(message: string) {
		super({
			code: ErrorCode.VALIDATION_ERROR,
			message,
			status: 400,
		});
	}
}
