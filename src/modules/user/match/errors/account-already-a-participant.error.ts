import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class AccountAlreadyAParticipantError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.ACCOUNT_ALREADY_A_PARTICIPANT,
			message: "Account is already a participant of the match",
		});
	}
}
