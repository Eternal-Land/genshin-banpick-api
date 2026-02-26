import { SocketEvents } from "@utils/constants";

export type SocketEventType = (typeof SocketEvents)[keyof typeof SocketEvents];
