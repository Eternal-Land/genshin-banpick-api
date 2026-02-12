import { ApiProperty } from "@nestjs/swagger";
export class CharacterListItem {
	@ApiProperty()
	id: number;

	@ApiProperty()
	icon: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	element: string;

	@ApiProperty()
	fetter: number;

	@ApiProperty()
	level: number;

	@ApiProperty()
	rarity: number;

	@ApiProperty()
	actived_constellation_num: number;

	@ApiProperty()
	image: string;

	@ApiProperty()
	is_chosen: boolean;

	@ApiProperty()
	side_icon: string;

	@ApiProperty()
	weapon_type: number;
}

export class CharacterListData {
	@ApiProperty()
	list: CharacterListItem[];
}

export class CharacterListResponse {
	@ApiProperty()
	retcode: number;

	@ApiProperty()
	message: string;

	@ApiProperty()
	data: CharacterListData;
}
