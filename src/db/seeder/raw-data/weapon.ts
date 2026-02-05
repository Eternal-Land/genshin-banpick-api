import { WeaponEntity } from "@db/entities";
import { WeaponRarity, WeaponType } from "@utils/enums";
import { DeepPartial } from "typeorm";

export const rawWeaps: DeepPartial<WeaponEntity>[] = [
	{
		key: "example_weapon",
		name: "Example Weapon",
		iconUrl: "https://example.com/icon.png",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.BOW,
	},
];
