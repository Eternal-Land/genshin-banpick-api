import { ApiError } from "@errors";
import { ErrorCode } from "@utils/enums";

export class HoyolabRequestFailedError extends ApiError {
	constructor(detail?: any) {
		super({
			code: ErrorCode.HOYOLAB_REQUEST_FAILED,
			message: "Hoyolab request failed",
			detail,
			status: 502,
		});
	}
}
