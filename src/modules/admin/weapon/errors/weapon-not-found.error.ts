import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class WeaponNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.WEAPON_NOT_FOUND,
			message: "Weapon not found",
			status: 404,
		});
	}
}
