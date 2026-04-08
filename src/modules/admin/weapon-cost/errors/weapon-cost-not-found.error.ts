import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class WeaponCostNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.WEAPON_COST_NOT_FOUND,
			message: "Weapon cost not found",
			status: 404,
		});
	}
}
