import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class HoyolabConfigMissingError extends ApiError {
	constructor() {
		super({
			code: ErrorCode.HOYOLAB_CONFIG_MISSING,
			message: "Hoyolab configuration is missing",
			status: 400,
		});
	}
}
