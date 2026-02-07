import { CharacterEntity } from "@db/entities";
import { CharacterElement, WeaponType } from "@utils/enums";
import { DeepPartial } from "typeorm";

export const rawChars: DeepPartial<CharacterEntity>[] = [
	{
		key: "albedo",
		name: "Albedo",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877352/albedo_bclkom.png",
		rarity: 5,
		element: CharacterElement.GEO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "alhaitham",
		name: "Alhaitham",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877353/alhaitham_aoazry.png",
		rarity: 5,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "aloy",
		name: "Aloy",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877355/aloy_ncbt19.png",
		rarity: 5,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "arlecchino",
		name: "Arlecchino",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877357/arlecchino_dgbyr7.png",
		rarity: 5,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "kamisato_ayaka",
		name: "Kamisato Ayaka",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877292/kamisato-ayaka_zvsfi9.png",
		rarity: 5,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "kamisato_ayato",
		name: "Kamisato Ayato",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877293/kamisato-ayato_wcczkh.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "baizhu",
		name: "Baizhu",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877358/baizhu_zwwdc7.png",
		rarity: 5,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "chasca",
		name: "Chasca",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877194/chasca_xs4bpj.png",
		rarity: 5,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "childe",
		name: "Childe",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877329/tartaglia_hityuo.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "chiori",
		name: "Chiori",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877195/chiori_irx5f4.png",
		rarity: 5,
		element: CharacterElement.GEO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "citlali",
		name: "Citlali",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877194/citlali_jadcyr.png",
		rarity: 5,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "clorinde",
		name: "Clorinde",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877195/clorinde_fubhuu.png",
		rarity: 5,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "columbina",
		name: "Columbina",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1770262867/columbina_ndcwbm.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "cyno",
		name: "Cyno",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877196/cyno_gmx21c.png",
		rarity: 5,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "dehya",
		name: "Dehya",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877196/dehya_xecypj.png",
		rarity: 5,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "diluc",
		name: "Diluc",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877196/diluc_yylffi.png",
		rarity: 5,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "durin",
		name: "Durin",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877198/durin_xzwovg.png",
		rarity: 5,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "emilie",
		name: "Emilie",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877199/emilie_clvzzf.png",
		rarity: 5,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "escoffier",
		name: "Escoffier",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877199/escoffier_z5kod6.png",
		rarity: 5,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "eula",
		name: "Eula",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877199/escoffier_z5kod6.png",
		rarity: 5,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "flins",
		name: "Flins",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877203/flins_ydkygx.png",
		rarity: 5,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "furina",
		name: "Furina",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877205/furina_owz4t6.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "ganyu",
		name: "Ganyu",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877206/ganyu_q87dva.png",
		rarity: 5,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "hutao",
		name: "Hu Tao",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877209/hu-tao_fnofog.png",
		rarity: 5,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "ineffa",
		name: "Ineffa",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877210/ineffa_trubhr.png",
		rarity: 5,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "ataraki_itto",
		name: "Ataraki Itto",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877356/arataki-itto_i9ku2h.png",
		rarity: 5,
		element: CharacterElement.GEO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "jean",
		name: "Jean",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877291/jean_fjq3v2.png",
		rarity: 5,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "kaedehara_kazuha",
		name: "Kaedehara Kazuha",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877292/kaedehara-kazuha_pwlzd9.png",
		rarity: 5,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "keqing",
		name: "Keqing",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877297/keqing_hlp7nv.png",
		rarity: 5,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "kinich",
		name: "Kinich",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877297/kinich_grfj3c.png",
		rarity: 5,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "klee",
		name: "Klee",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877298/klee_dzados.png",
		rarity: 5,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "sangonomiya_kokomi",
		name: "Sangonomiya Kokomi",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877321/sangonomiya-kokomi_va4kxz.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "lauma",
		name: "Lauma",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877302/lauma_d1kadq.png",
		rarity: 5,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "lyney",
		name: "Lyney",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877305/lyney_gxuuwv.png",
		rarity: 5,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "mavuika",
		name: "Mavuika",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877306/mavuika_qc2av8.png",
		rarity: 5,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "mona",
		name: "Mona",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877309/mona_cnvsz9.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "mualani",
		name: "Mualani",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877309/mualani_wwfh9h.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "nahida",
		name: "Nahida",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877310/nahida_gjvmxf.png",
		rarity: 5,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "navia",
		name: "Navia",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877310/navia_n5zy9x.png",
		rarity: 5,
		element: CharacterElement.GEO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "nefer",
		name: "Nefer",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877311/nefer_ear1nl.png",
		rarity: 5,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "neuvillette",
		name: "Neuvillette",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877314/neuvillette_wvesxo.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "nilou",
		name: "Nilou",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877314/nilou_iymxj3.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "qiqi",
		name: "Qiqi",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877318/qiqi_lt8jtv.png",
		rarity: 5,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "raiden_shogun",
		name: "Raiden Shogun",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877319/raiden-shogun_lxknci.png",
		rarity: 5,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "shenhe",
		name: "Shenhe",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877323/shenhe_fy5ecv.png",
		rarity: 5,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "sigewinne",
		name: "Sigewinne",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877325/sigewinne_nmfuhi.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "skirk",
		name: "Skirk",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877326/skirk_fq6fjc.png",
		rarity: 5,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "tighnari",
		name: "Tighnari",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877330/tighnari_v8gjv7.png",
		rarity: 5,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "traveller_anemo",
		name: "Traveller Anemo",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877331/traveler_cvshcm.png",
		rarity: 5,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "traveller_geo",
		name: "Traveller Geo",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877331/traveler_cvshcm.png",
		rarity: 5,
		element: CharacterElement.GEO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "traveller_electro",
		name: "Traveller Electro",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877331/traveler_cvshcm.png",
		rarity: 5,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "traveller_dendro",
		name: "Traveller Dendro",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877331/traveler_cvshcm.png",
		rarity: 5,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "traveller_hydro",
		name: "Traveller Hydro",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877331/traveler_cvshcm.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "traveller_pyro",
		name: "Traveller Pyro",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877331/traveler_cvshcm.png",
		rarity: 5,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "varesa",
		name: "Varesa",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877333/varesa_wo7mqb.png",
		rarity: 5,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "venti",
		name: "Venti",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877333/venti_fetznx.png",
		rarity: 5,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "wanderer",
		name: "Wanderer",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877334/wanderer_yksx2a.png",
		rarity: 5,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "wriothesley",
		name: "Wriothesley",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877336/wriothesley_fhsssu.png",
		rarity: 5,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "xianyun",
		name: "Xianyun",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877337/xianyun_zqkmba.png",
		rarity: 5,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "xiao",
		name: "Xiao",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877337/xiao_j19a4a.png",
		rarity: 5,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "xilonen",
		name: "Xilonen",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877339/xilonen_lbsbje.png",
		rarity: 5,
		element: CharacterElement.GEO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "yae_miko",
		name: "Yae Miko",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877343/yae-miko_gfdkbp.png",
		rarity: 5,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "yelan",
		name: "Yelan",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877348/yelan_xvxvv4.png",
		rarity: 5,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "yoimiya",
		name: "Yoimiya",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877354/yoimiya_cpe7vc.png",
		rarity: 5,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "yumemizuki_mizuki",
		name: "Yumemizuki Mizuki",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877309/mizuki_bzoma5.png",
		rarity: 5,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "zhongli",
		name: "Zhongli",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877352/zhongli_dyd174.png",
		rarity: 5,
		element: CharacterElement.GEO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "zibai",
		name: "Zibai",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1770262867/zibai_zktbud.png",
		rarity: 5,
		element: CharacterElement.GEO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "aino",
		name: "Aino",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877352/aino_oreekw.png",
		rarity: 4,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "amber",
		name: "Amber",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877356/amber_kl46jn.png",
		rarity: 4,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "barbara",
		name: "Barbara",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877361/barbara_drm2ra.png",
		rarity: 4,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "beidou",
		name: "Beidou",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877361/beidou_jmy3o0.png",
		rarity: 4,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "bennett",
		name: "Bennett",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877361/bennett_jlrnvc.png",
		rarity: 4,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "candace",
		name: "Candace",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877194/candace_l7muhp.png",
		rarity: 4,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "charlotte",
		name: "Charlotte",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877194/charlotte_g19k7t.png",
		rarity: 4,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "chevreuse",
		name: "Chevreuse",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877195/chevreuse_zegupr.png",
		rarity: 4,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "chongyun",
		name: "Chongyun",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877195/chongyun_daymst.png",
		rarity: 4,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "collei",
		name: "Collei",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877195/collei_d2hooz.png",
		rarity: 4,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "dahlia",
		name: "Dahlia",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877195/dahlia_trclpm.png",
		rarity: 4,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "diona",
		name: "Diona",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877197/diona_svoa8r.png",
		rarity: 4,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "dori",
		name: "Dori",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877198/dori_qsahif.png",
		rarity: 4,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "faruzan",
		name: "Faruzan",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877201/faruzan_vf1axf.png",
		rarity: 4,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "fischl",
		name: "Fischl",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877202/fischl_akwncc.png",
		rarity: 4,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "freminet",
		name: "Freminet",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877204/freminet_k3o561.png",
		rarity: 4,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "gaming",
		name: "Gaming",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877206/gaming_ed1l0r.png",
		rarity: 4,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "gorou",
		name: "Gorou",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877209/gorou_tgxkso.png",
		rarity: 4,
		element: CharacterElement.GEO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "shikanoin_heizou",
		name: "Shikanoin Heizou",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877325/shikanoin-heizou_e2blqn.png",
		rarity: 4,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "iansan",
		name: "Iansan",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877210/iansan_otxvo3.png",
		rarity: 4,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "ifa",
		name: "Ifa",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877210/ifa_d8it42.png",
		rarity: 4,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "illuga",
		name: "Illuga",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1770262867/illuga_btdqzi.png",
		rarity: 4,
		element: CharacterElement.GEO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "jahoda",
		name: "Jahoda",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877242/jahoda_oovop8.png",
		rarity: 4,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "kachina",
		name: "Kachina",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877291/kachina_t8znwu.png",
		rarity: 4,
		element: CharacterElement.GEO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "kaeya",
		name: "Kaeya",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877292/kaeya_qqpjf6.png",
		rarity: 4,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "kaveh",
		name: "Kaveh",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877297/kaveh_vybebg.png",
		rarity: 4,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "kirara",
		name: "Kirara",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877298/kirara_xsr4on.png",
		rarity: 4,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "kuki_shinobu",
		name: "Kuki Shinobu",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877301/kuki-shinobu_cjbyye.png",
		rarity: 4,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "lan_yan",
		name: "Lan Yan",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877301/lanyan_xjaivw.png",
		rarity: 4,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "layla",
		name: "Layla",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877302/layla_jjh6ez.png",
		rarity: 4,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "lisa",
		name: "Lisa",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877305/lisa_lutid4.png",
		rarity: 4,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "lynette",
		name: "Lynette",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877305/lynette_zzxbsz.png",
		rarity: 4,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "mika",
		name: "Mika",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877306/mika_wu2vk0.png",
		rarity: 4,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "ningguang",
		name: "Ningguang",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877314/ningguang_h7slif.png",
		rarity: 4,
		element: CharacterElement.GEO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "noelle",
		name: "Noelle",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877315/noelle_po5sjk.png",
		rarity: 4,
		element: CharacterElement.GEO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "ororon",
		name: "Ororon",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877317/ororon_vgkcux.png",
		rarity: 4,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "razor",
		name: "Razor",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877320/razor_munmky.png",
		rarity: 4,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "rosaria",
		name: "Rosaria",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877321/rosaria_jsfbwx.png",
		rarity: 4,
		element: CharacterElement.CRYO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "kujou_sara",
		name: "Kujou Sara",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877301/kujou-sara_hjzujq.png",
		rarity: 4,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "sayu",
		name: "Sayu",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877322/sayu_p3eqcx.png",
		rarity: 4,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "sethos",
		name: "Sethos",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877323/sethos_g346tf.png",
		rarity: 4,
		element: CharacterElement.ELECTRO,
		weaponType: WeaponType.BOW,
	},
	{
		key: "sucrose",
		name: "Sucrose",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877328/sucrose_jl08gt.png",
		rarity: 4,
		element: CharacterElement.ANEMO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "thoma",
		name: "Thoma",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877329/thoma_wxid5l.png",
		rarity: 4,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "xiangling",
		name: "Xiangling",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877336/xiangling_sb0fn3.png",
		rarity: 4,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "xingqiu",
		name: "Xingqiu",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877341/xingqiu_rpiuky.png",
		rarity: 4,
		element: CharacterElement.HYDRO,
		weaponType: WeaponType.SWORD,
	},
	{
		key: "xinyan",
		name: "Xinyan",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877341/xinyan_lrbrph.png",
		rarity: 4,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.CLAYMORE,
	},
	{
		key: "yanfei",
		name: "Yanfei",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877347/yanfei_yiip4k.png",
		rarity: 4,
		element: CharacterElement.PYRO,
		weaponType: WeaponType.CATALYST,
	},
	{
		key: "yaoyao",
		name: "Yaoyao",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877347/yaoyao_qi3br3.png",
		rarity: 4,
		element: CharacterElement.DENDRO,
		weaponType: WeaponType.POLEARM,
	},
	{
		key: "yun_jin",
		name: "Yun Jin",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877351/yun-jin_ayv0qh.png",
		rarity: 4,
		element: CharacterElement.GEO,
		weaponType: WeaponType.POLEARM,
	},
];
