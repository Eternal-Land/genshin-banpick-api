import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class CharacterNotFoundError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.CHARACTER_NOT_FOUND,
			message: "Character not found",
			status: 404,
		});
	}
}
