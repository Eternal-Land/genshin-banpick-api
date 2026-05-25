import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class WrongEmailOrIngameUidError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.WRONG_EMAIL_OR_INGAME_UID,
			message: "Wrong email or ingame UID",
			status: 400,
		});
	}
}
