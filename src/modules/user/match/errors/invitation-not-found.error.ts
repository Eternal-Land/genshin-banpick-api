import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class InvitationNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.INVITATION_NOT_FOUND,
			message: "Invitation not found",
			status: 404,
		});
	}
}
