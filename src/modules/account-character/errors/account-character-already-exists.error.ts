import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class AccountCharacterAlreadyExistsError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.ACCOUNT_CHARACTER_ALREADY_EXISTS,
			message: "Account character already exists",
			status: 409,
		});
	}
}
