import { WeaponCostEntity } from "@db/entities";
import { WeaponCostUnit, WeaponRarity } from "@utils/enums";
import { DeepPartial } from "typeorm";

export const weaponCostsRawData: DeepPartial<WeaponCostEntity>[] = [
	{
		upgradeLevel: 1,
		weaponRarity: WeaponRarity.WEAPON_SS,
		unit: WeaponCostUnit.COST,
		value: 1,
	},
	{
		upgradeLevel: 1,
		weaponRarity: WeaponRarity.WEAPON_S,
		unit: WeaponCostUnit.COST,
		value: 1,
	},
	{
		upgradeLevel: 1,
		weaponRarity: WeaponRarity.WEAPON_NORMAL,
		unit: WeaponCostUnit.COST,
		value: 0.5,
	},
	{
		upgradeLevel: 2,
		weaponRarity: WeaponRarity.WEAPON_SS,
		unit: WeaponCostUnit.SECONDS,
		value: 3,
	},
	{
		upgradeLevel: 2,
		weaponRarity: WeaponRarity.WEAPON_S,
		unit: WeaponCostUnit.SECONDS,
		value: 2,
	},
	{
		upgradeLevel: 2,
		weaponRarity: WeaponRarity.WEAPON_NORMAL,
		unit: WeaponCostUnit.COST,
		value: 0.5,
	},
	{
		upgradeLevel: 3,
		weaponRarity: WeaponRarity.WEAPON_SS,
		unit: WeaponCostUnit.SECONDS,
		value: 3,
	},
	{
		upgradeLevel: 3,
		weaponRarity: WeaponRarity.WEAPON_S,
		unit: WeaponCostUnit.SECONDS,
		value: 2,
	},
	{
		upgradeLevel: 3,
		weaponRarity: WeaponRarity.WEAPON_NORMAL,
		unit: WeaponCostUnit.COST,
		value: 0.5,
	},
	{
		upgradeLevel: 4,
		weaponRarity: WeaponRarity.WEAPON_SS,
		unit: WeaponCostUnit.SECONDS,
		value: 3,
	},
	{
		upgradeLevel: 4,
		weaponRarity: WeaponRarity.WEAPON_S,
		unit: WeaponCostUnit.SECONDS,
		value: 2,
	},
	{
		upgradeLevel: 4,
		weaponRarity: WeaponRarity.WEAPON_NORMAL,
		unit: WeaponCostUnit.COST,
		value: 1,
	},
	{
		upgradeLevel: 5,
		weaponRarity: WeaponRarity.WEAPON_SS,
		unit: WeaponCostUnit.SECONDS,
		value: 3,
	},
	{
		upgradeLevel: 5,
		weaponRarity: WeaponRarity.WEAPON_S,
		unit: WeaponCostUnit.SECONDS,
		value: 2,
	},
	{
		upgradeLevel: 5,
		weaponRarity: WeaponRarity.WEAPON_NORMAL,
		unit: WeaponCostUnit.COST,
		value: 1,
	},
];
