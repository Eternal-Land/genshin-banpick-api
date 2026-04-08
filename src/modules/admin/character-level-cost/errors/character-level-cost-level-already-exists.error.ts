import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class CharacterLevelCostLevelAlreadyExistsError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.CHARACTER_LEVEL_COST_LEVEL_ALREADY_EXISTS,
			message: "Character level cost already exists for this character",
			status: 400,
		});
	}
}
