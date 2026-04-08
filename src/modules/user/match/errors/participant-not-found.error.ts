import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class ParticipantNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.PARTICIPANT_NOT_FOUND,
			message: "Participant not found",
			status: 404,
		});
	}
}
