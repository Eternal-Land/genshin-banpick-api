import {
	ExceptionFilter,
	ArgumentsHost,
	Catch,
	HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { BaseApiResponse } from "./dto/base-api-response";
import { ErrorCode } from "./enums/error-code";
import { ApiError } from "@errors";
import * as dayjs from "dayjs";

@Catch()
export class MyExceptionFilter implements ExceptionFilter {
	/**
	 * Handles the thrown exception.
	 *
	 * @param exception The thrown exception.
	 * @param host The arguments host providing access to the request/response objects.
	 */
	catch(exception: any, host: ArgumentsHost) {
		const res = host.switchToHttp().getResponse<Response>();

		if (exception instanceof ApiError) {
			return res
				.status(exception.status)
				.send(
					BaseApiResponse.error(
						exception.code,
						exception.message,
						exception.detail,
					),
				);
		}

		const req = host.switchToHttp().getRequest<Request>();
		console.log(
			`EXCEPTION [${req.ip}] [${dayjs().format("YYYY-MM-DD HH:mm:ss")}] [${req.method}] [${req.url}]`,
		);
		console.error(exception);

		if (exception instanceof HttpException) {
			return res
				.status(exception.getStatus())
				.send(
					BaseApiResponse.error(
						ErrorCode.UNKNOWN_ERROR,
						exception.message,
						exception.getResponse(),
					),
				);
		}

		return res
			.status(500)
			.send(
				BaseApiResponse.error(
					ErrorCode.UNKNOWN_ERROR,
					"Unknown error occurred",
					exception,
				),
			);
	}
}
