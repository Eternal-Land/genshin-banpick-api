import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class CharacterKeyAlreadyExistsError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.CHARACTER_KEY_ALREADY_EXISTS,
			message: "Character key already exists",
			status: 409,
		});
	}
}
