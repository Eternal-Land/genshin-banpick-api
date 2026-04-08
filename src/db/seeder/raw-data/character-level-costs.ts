import { rawChars } from "./characters";

type CharacterLevelCostSeedItem = {
	key: string;
	levelCosts: Array<{
		level: 95 | 100;
		cost: number;
	}>;
};

// Replace each cost value with your imported data.
export const characterLevelCostsRawData: CharacterLevelCostSeedItem[] = [
	{
		key: "durin",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "mavuika",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "arlecchino",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "lyney",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "yoimiya",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "hu_tao",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "klee",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "chevreuse",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "bennett",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 1 },
		],
	},
	{
		key: "gaming",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "xiangling",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "xinyan",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "yanfei",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "thoma",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "amber",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "dehya",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "nefer",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "lauma",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "kinich",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "emilie",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "baizhu",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "nahida",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "alhaitham",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "tighnari",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "kirara",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "kaveh",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "collei",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "yaoyao",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "skirk",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "escoffier",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "citlali",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "wriothesley",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "shenhe",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "kamisato_ayaka",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "eula",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "ganyu",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "charlotte",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "freminet",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "mika",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "layla",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "chongyun",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "diona",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "kaeya",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "rosaria",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "flins",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "ineffa",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "varesa",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "clorinde",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "raiden_shogun",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "cyno",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "iansan",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "yae_miko",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "kuki_shinobu",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 1 },
		],
	},
	{
		key: "ororon",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "sethos",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "dori",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "razor",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "fischl",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "beidou",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "kujou_sara",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 1 },
		],
	},
	{
		key: "lisa",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "keqing",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "chasca",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "xianyun",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "xiao",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "venti",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "wanderer",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "kaedehara_kazuha",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "jahoda",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "ifa",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "sucrose",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "lan_yan",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "lynette",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "faruzan",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "shikanoin_heizou",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "sayu",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "varka",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 1 },
		],
	},
	{
		key: "xilonen",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "chiori",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "zhongli",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "albedo",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "navia",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "ataraki_itto",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "kachina",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "ningguang",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "noelle",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "gorou",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "yun_jin",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "zibai",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "illuga",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "linnea",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "sigewinne",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "furina",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "mualani",
		levelCosts: [
			{ level: 95, cost: 3 },
			{ level: 100, cost: 5 },
		],
	},
	{
		key: "neuvillette",
		levelCosts: [
			{ level: 95, cost: 3 },
			{ level: 100, cost: 5 },
		],
	},
	{
		key: "nilou",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "yelan",
		levelCosts: [
			{ level: 95, cost: 2 },
			{ level: 100, cost: 4 },
		],
	},
	{
		key: "kamisato_ayato",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "sangonomiya_kokomi",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "childe",
		levelCosts: [
			{ level: 95, cost: 1 },
			{ level: 100, cost: 2 },
		],
	},
	{
		key: "mona",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "aino",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "dahlia",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "candace",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "xingqiu",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "barbara",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 0 },
		],
	},
	{
		key: "columbina",
		levelCosts: [
			{ level: 95, cost: 0 },
			{ level: 100, cost: 1 },
		],
	},
];
