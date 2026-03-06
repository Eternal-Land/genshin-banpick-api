import { Global, Module } from "@nestjs/common";
import { SocketMatchService, SocketService } from "./services";
import { SocketGateway } from "./socket.gateway";

const services = [SocketService, SocketMatchService];

@Global()
@Module({
	providers: [...services, SocketGateway],
	exports: [...services],
})
export class SocketModule {}
