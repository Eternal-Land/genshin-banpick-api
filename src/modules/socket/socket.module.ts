import { Global, Module } from "@nestjs/common";
import { SocketMatchService, SocketService } from "./services";
import { SocketGateway } from "./socket.gateway";
import { UserSessionRecordModule } from "@modules/user/session-record";

const services = [SocketService, SocketMatchService];

@Global()
@Module({
	imports: [UserSessionRecordModule],
	providers: [...services, SocketGateway],
	exports: [...services],
})
export class SocketModule {}
