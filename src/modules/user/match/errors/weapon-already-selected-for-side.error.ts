import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class WeaponAlreadySelectedForSideError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.VALIDATION_ERROR,
			message: "Weapon has already been selected for this side",
			status: 400,
		});
	}
}
