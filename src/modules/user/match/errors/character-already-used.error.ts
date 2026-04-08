import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class CharacterAlreadyUsedError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.VALIDATION_ERROR,
			message: "Character has already been selected or banned",
			status: 400,
		});
	}
}
