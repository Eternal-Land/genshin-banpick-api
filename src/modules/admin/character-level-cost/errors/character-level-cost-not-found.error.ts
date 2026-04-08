import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class CharacterLevelCostNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.CHARACTER_LEVEL_COST_NOT_FOUND,
			message: "Character level cost not found",
			status: 404,
		});
	}
}
