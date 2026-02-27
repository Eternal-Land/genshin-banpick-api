import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class MatchInvitationExistedError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.MATCH_INVITATION_EXISTED,
			message: "An invitation for this account and match already exists",
		});
	}
}
