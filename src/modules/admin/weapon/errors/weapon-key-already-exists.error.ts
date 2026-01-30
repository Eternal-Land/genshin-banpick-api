import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class WeaponKeyAlreadyExistsError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.WEAPON_KEY_ALREADY_EXISTS,
			message: "Weapon key already exists",
			status: 409,
		});
	}
}
