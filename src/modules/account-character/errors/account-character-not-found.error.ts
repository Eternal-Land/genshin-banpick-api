import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class AccountCharacterNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.ACCOUNT_CHARACTER_NOT_FOUND,
			message: "Account character not found",
			status: 404,
		});
	}
}
