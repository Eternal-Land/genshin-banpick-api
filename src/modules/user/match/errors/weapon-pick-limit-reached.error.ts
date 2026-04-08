import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class WeaponPickLimitReachedError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.VALIDATION_ERROR,
			message: "All selected characters already have weapons",
			status: 400,
		});
	}
}
