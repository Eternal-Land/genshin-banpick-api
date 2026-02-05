import { CharacterEntity } from "@db/entities";
import { CharacterElement, WeaponType } from "@utils/enums";
import { DeepPartial } from "typeorm";

export const rawChars: DeepPartial<CharacterEntity>[] = [
	{
		key: "example_character",
		name: "Example Character",
		iconUrl: "https://example.com/icon.png",
		rarity: 5,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.SWORD,
	},
];
