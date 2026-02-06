import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class CharacterCostNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.CHARACTER_COST_NOT_FOUND,
			message: "Character cost not found",
			status: 404,
		});
	}
}
