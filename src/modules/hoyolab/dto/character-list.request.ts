import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CharacterListRequest {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	uid: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	server: string;

	@ApiProperty({ required: false, default: 1 })
	@IsOptional()
	@IsInt()
	@Min(1)
	sortType?: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	generalCookie: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	cookieTokenV2: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	ltokenV2: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	language?: string;
}
