import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class StaffRoleNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.STAFF_ROLE_NOT_FOUND,
			message: "Staff role not found",
			status: 404,
		});
	}
}
