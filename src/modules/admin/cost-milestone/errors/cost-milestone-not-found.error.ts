import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class CostMilestoneNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.COST_MILESTONE_NOT_FOUND,
			message: "Cost milestone not found",
			status: 404,
		});
	}
}
