import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class StaffEmailAlreadyExistsError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.STAFF_EMAIL_ALREADY_EXISTS,
			message: "Staff email already exists",
			status: 409,
		});
	}
}
