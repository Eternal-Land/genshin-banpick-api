import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class WeaponPickRequiresSelectedCharacterError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.VALIDATION_ERROR,
			message: "Cannot pick weapon before selecting at least one character",
			status: 400,
		});
	}
}
