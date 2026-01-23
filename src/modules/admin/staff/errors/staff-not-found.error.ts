import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class StaffNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.STAFF_NOT_FOUND,
			message: "Staff not found",
			status: 404,
		});
	}
}
