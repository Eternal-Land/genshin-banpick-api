import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class WeaponCostMilestoneNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.WEAPON_COST_MILESTONE_NOT_FOUND,
			message: "Weapon cost milestone not found",
			status: 404,
		});
	}
}
