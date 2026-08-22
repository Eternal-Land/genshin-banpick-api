import { Global, Module } from "@nestjs/common";
import { SocketMatchService, SocketService } from "./services";
import { SocketGateway } from "./socket.gateway";
import { UserSessionRecordModule } from "@modules/user/session-record";
import { MatchModule } from "@modules/user/match";

const services = [SocketService, SocketMatchService];

@Global()
@Module({
	imports: [UserSessionRecordModule, MatchModule],
	providers: [...services, SocketGateway],
	exports: [...services],
})
export class SocketModule {}
