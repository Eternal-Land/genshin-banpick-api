import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { SocketEvents } from "@utils/constants";
import { Socket } from "socket.io";

@Catch()
export class SocketExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost): void {
		console.error("WebSocket Exception:", exception);
		const client = host.switchToWs().getClient<Socket>();
		let errorMsg = "An unexpected error occurred";

		if (exception instanceof WsException) {
			const wsError = exception.getError();
			if (typeof wsError === "string") {
				errorMsg = wsError;
			} else if (Array.isArray(wsError)) {
				errorMsg = wsError
					.map((item) =>
						typeof item === "string"
							? item
							: (item as { constraints?: Record<string, string> })?.constraints
								? Object.values(
										(item as { constraints: Record<string, string> })
											.constraints,
									).join(", ")
								: "",
					)
					.filter(Boolean)
					.join("; ");
			} else if (
				typeof wsError === "object" &&
				wsError !== null &&
				"message" in wsError &&
				typeof (wsError as { message?: unknown }).message === "string"
			) {
				errorMsg = (wsError as { message: string }).message;
			}
		} else if (exception instanceof Error) {
			errorMsg = exception.message || errorMsg;
		} else if (
			typeof exception === "object" &&
			exception !== null &&
			"message" in exception &&
			typeof (exception as { message?: unknown }).message === "string"
		) {
			errorMsg = (exception as { message: string }).message || errorMsg;
		}

		client.emit(SocketEvents.ERROR, errorMsg);
	}
}
