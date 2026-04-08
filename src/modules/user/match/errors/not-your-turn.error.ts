import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class NotYourTurnError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.PERMISSION_DENIED,
			message: "It is not your turn",
			status: 400,
		});
	}
}
