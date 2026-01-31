import { ApiProperty } from "@nestjs/swagger";

export class CharacterListResponse {
	@ApiProperty()
	retcode: number;

	@ApiProperty()
	message: string;

	@ApiProperty()
	data?: Record<string, any>;
}
