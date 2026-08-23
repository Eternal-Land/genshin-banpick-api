import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as dayjs from "dayjs";
import { Request } from "express";

export class ApiLoggerInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>) {
		const request = context.switchToHttp().getRequest<Request>();
		console.log(
			`INCOMING_REQUEST [${dayjs().format("YYYY-MM-DD HH:mm:ss")}] [${request.ip}] [${request.method}] [${request.url}]`,
		);

		return next.handle().pipe();
	}
}
