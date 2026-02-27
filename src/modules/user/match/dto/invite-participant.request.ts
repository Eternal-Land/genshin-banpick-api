import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class InviteParticipantRequest {
	@ApiProperty()
	@IsString()
	matchId: string;

	@ApiProperty()
	@IsString()
	accountId: string;
}
