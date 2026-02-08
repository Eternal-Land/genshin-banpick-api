import { WeaponEntity } from "@db/entities";
import { WeaponRarity, WeaponType } from "@utils/enums";
import { DeepPartial } from "typeorm";

export const rawWeaps: DeepPartial<WeaponEntity>[] = [
	{
		key: "reliquary_of_truth",
		name: "Reliquary of Truth",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877620/Reliquary_of_Truth_ee2qkd.png",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.CATALYST,
	},
	{
		key: "azurelight",
		name: "Azurelight",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877681/Azurelight_gipssd.webp",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.SWORD,
	},
	{
		key: "bloodsoaked_ruins",
		name: "Bloodsoaked Ruins",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877685/Bloodsoaked_Ruins_rvofeb.png",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.POLEARM,
	},
	{
		key: "the_daybreak_chronicles",
		name: "The Daybreak Chronicles",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877648/The_Daybreak_Chronicles_x6ielt.png",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.BOW,
	},
	{
		key: "vivid_notions",
		name: "Vivid Notions",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877661/Vivid_Notions_cg79tp.webp",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.CATALYST,
	},
	{
		key: "a_thousand_blazing_suns",
		name: "A Thousand Blazing Suns",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877667/A_Thousand_Blazing_Suns_extcfg.webp",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.CLAYMORE,
	},
	{
		key: "astral_vultures_crimson_plumage",
		name: "Astral Vulture's Crimson Plumage",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877677/Astral_Vulture_s_Crimson_Plumage_w0kj4b.webp",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.BOW,
	},
	{
		key: "surfs_up",
		name: "Surf's Up",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877645/Surf_s_Up_fqfrxv.webp",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.CATALYST,
	},
	{
		key: "fang_of_the_mountain_king",
		name: "Fang of the Mountain King",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877594/Fang_of_the_Mountain_King_pkkqij.webp",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.CLAYMORE,
	},
	{
		key: "tome_of_the_eternal_flow",
		name: "Tome of the Eternal Flow",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877655/Tome_of_the_Eternal_Flow_dn8hab.webp",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.CATALYST,
	},
	{
		key: "nocturnes_curtain_call",
		name: "Nocturne's Curtain Call",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1770345129/Nocturnes_Curtain_Call_xtheta.png",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.CATALYST,
	},
	{
		key: "lightbearing_moonshard",
		name: "Lightbearing Moonshard",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1770345128/lightbearing_moonshard_c4uyvz.png",
		rarity: WeaponRarity.WEAPON_SS,
		type: WeaponType.SWORD,
	},
	{
		key: "absolution",
		name: "Absolution",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877670/Absolution_dyw0gx.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.SWORD,
	},
	{
		key: "staff_of_homa",
		name: "Staff of Homa",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877636/Staff_of_Homa_fdkf0s.png",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.POLEARM,
	},
	{
		key: "kaguras_verity",
		name: "Kagura's Verity",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877601/Kagura_s_Verity_a5gj1m.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.CATALYST,
	},
	{
		key: "mistsplitter_reforged",
		name: "Mistsplitter Reforged",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877609/Mistsplitter_Reforged_snm81v.png",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.SWORD,
	},
	{
		key: "aqua_simulacra",
		name: "Aqua Simulacra",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877673/Aqua_Simulacra_henaoc.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.BOW,
	},
	{
		key: "key_of_khaj_nisut",
		name: "Key of Khaj-Nisut",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877602/Key_of_Khaj-Nisut_erhbp7.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.SWORD,
	},
	{
		key: "the_first_great_magic",
		name: "The First Great Magic",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877649/The_First_Great_Magic_yiwk6d.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.BOW,
	},
	{
		key: "cashflow_supervision",
		name: "Cashflow Supervision",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877688/Cashflow_Supervision_mmpfjr.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.CATALYST,
	},
	{
		key: "uraku_misugiri",
		name: "Uraku Misugiri",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877657/Uraku_Misugiri_vokerv.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.SWORD,
	},
	{
		key: "crimson_moons_semblance",
		name: "Crimson Moon's Semblance",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877691/Crimson_Moon_s_Semblance_lwjdue.png",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.CLAYMORE,
	},
	{
		key: "silvershower_heartstrings",
		name: "Silvershower Heartstrings",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877622/Silvershower_Heartstrings_hnsaew.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.BOW,
	},
	{
		key: "lumidouce_elegy",
		name: "Lumidouce Elegy",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877610/Lumidouce_Elegy_ztkshy.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.POLEARM,
	},
	{
		key: "elegy_of_the_end",
		name: "Elegy of the End",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877694/Elegy_for_the_End_kfodoa.png",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.BOW,
	},
	{
		key: "freedom_sworn",
		name: "Freedom-Sworn",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877596/Freedom-Sworn_d9ukvw.png",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.SWORD,
	},
	{
		key: "cranes_echoing_call",
		name: "Crane's Echoing Call",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877690/Crane_s_Echoing_Call_hae1yv.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.CATALYST,
	},
	{
		key: "symphonist_of_scents",
		name: "Symphonist of Scents",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877646/Symphonist_of_Scents_xhwbxx.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.POLEARM,
	},
	{
		key: "fractured_halo",
		name: "Fractured Halo",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877595/Fractured_Halo_gpqosj.png",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.POLEARM,
	},
	{
		key: "nightwavers_looking_glass",
		name: "Nightwaver's Looking Glass",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877611/Nightweaver_s_Looking_Glass_ncmi0z.png",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.CATALYST,
	},
	{
		key: "athame_artis",
		name: "Athame Artis",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877679/Athame_Artis_ffjxju.png",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.SWORD,
	},
	{
		key: "peak_patrol_song",
		name: "Peak Patrol Song",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877612/Peak_Patrol_Song_m0lvsd.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.SWORD,
	},
	{
		key: "starcallers_watch",
		name: "Starcaller's Watch",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877639/Starcaller_s_Watch_uo1ho5.webp",
		rarity: WeaponRarity.WEAPON_S,
		type: WeaponType.CATALYST,
	},
	{
		key: "everlasting_moonglow",
		name: "Everlasting Moonglow",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877595/Everlasting_Moonglow_etf0ar.png",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CATALYST,
	},
	{
		key: "primordial_jade_winged_spear",
		name: "Primordial Jade Winged-Spear",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877617/Primordial_Jade_Winged-Spear_hhu7jd.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.POLEARM,
	},
	{
		key: "lost_prayer_to_the_sacred_winds",
		name: "Lost Prayer to the Sacred Winds",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877605/Lost_Prayer_to_the_Sacred_Winds_a2mgoo.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CATALYST,
	},
	{
		key: "skyward_pride",
		name: "Skyward Pride",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877629/Skyward_Pride_xntbqr.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CLAYMORE,
	},
	{
		key: "skyward_blade",
		name: "Skyward Blade",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877625/Skyward_Blade_vac0b2.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.SWORD,
	},
	{
		key: "skyward_atlas",
		name: "Skyward Atlas",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877623/Skyward_Atlas_grtd7o.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CATALYST,
	},
	{
		key: "skyward_harp",
		name: "Skyward Harp",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877627/Skyward_Harp_mhu5th.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.BOW,
	},
	{
		key: "skyward_spine",
		name: "Skyward Spine",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877631/Skyward_Spine_bt6ynx.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.POLEARM,
	},
	{
		key: "memory_of_dust",
		name: "Memory of Dust",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877608/Memory_of_Dust_it2qok.png",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CATALYST,
	},
	{
		key: "the_unforged",
		name: "The Unforged",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877651/The_Unforged_kncgh7.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CLAYMORE,
	},
	{
		key: "summit_shaper",
		name: "Summit Shaper",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877641/Summit_Shaper_cdql91.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.SWORD,
	},
	{
		key: "song_of_broken_pines",
		name: "Song of Broken Pines",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877632/Song_of_Broken_Pines_z7ojbl.png",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CLAYMORE,
	},
	{
		key: "wolfs_gravestone",
		name: "Wolf's Gravestone",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877665/Wolf_s_Gravestone_knz8cn.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CLAYMORE,
	},
	{
		key: "primordial_jade_cutter",
		name: "Primordial Jade Cutter",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877615/Primordial_Jade_Cutter_jz2jxy.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.SWORD,
	},
	{
		key: "vortex_vanquisher",
		name: "Vortex Vanquisher",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877664/Vortex_Vanquisher_ckd90i.png",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.POLEARM,
	},
	{
		key: "amos_bow",
		name: "Amos' Bow",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877672/Amos__Bow_awnfxs.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.BOW,
	},
	{
		key: "aquila_favonia",
		name: "Aquila Favonia",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877676/Aquila_Favonia_rlnz7k.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.SWORD,
	},
	{
		key: "staff_of_the_scarlet_sands",
		name: "Staff of the Scarlet Sands",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877638/Staff_of_the_Scarlet_Sands_ymbftq.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.POLEARM,
	},
	{
		key: "beacon_of_the_reed_sea",
		name: "Beacon of the Reed Sea",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877682/Beacon_of_the_Reed_Sea_x6q60c.png",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CLAYMORE,
	},
	{
		key: "jadefalls_splendor",
		name: "Jadefall's Splendor",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877600/Jadefall_s_Splendor_t3ulhb.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CATALYST,
	},
	{
		key: "sunny_morning_sleep-in",
		name: "Sunny Morning Sleep-in",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877642/Sunny_Morning_Sleep-In_w4yr69.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CATALYST,
	},
	{
		key: "redhorn_stonethresher",
		name: "Redhorn Stonethresher",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877619/Redhorn_Stonethresher_nxljri.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CLAYMORE,
	},
	{
		key: "hunters_path",
		name: "Hunter's Path",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877599/Hunter_s_Path_hzduex.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.BOW,
	},
	{
		key: "polar_star",
		name: "Polar Star",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877613/Polar_Star_ndxndl.png",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.BOW,
	},
	{
		key: "haran_geppaku_futsu",
		name: "Haran Geppaku Futsu",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877597/Haran_Geppaku_Futsu_twukt0.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.SWORD,
	},
	{
		key: "engulfing_lightning",
		name: "Engulfing Lightning",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877695/Engulfing_Lightning_aypcq4.png",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.POLEARM,
	},
	{
		key: "thundering_pulse",
		name: "Thundering Pulse",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877652/Thundering_Pulse_hpkqek.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.BOW,
	},
	{
		key: "tulaytullahs_remembrance",
		name: "Tulaytullah's Remembrance",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877656/Tulaytullah_s_Remembrance_qz00dh.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CATALYST,
	},
	{
		key: "splendor_of_tranquil_waters",
		name: "Splendor of Tranquil Waters",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877635/Splendor_of_Tranquil_Waters_cf4fyt.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.SWORD,
	},
	{
		key: "light_of_foliar_incision",
		name: "Light of Foliar Incision",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877604/Light_of_Foliar_Incision_x6hikg.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.SWORD,
	},
	{
		key: "verdict",
		name: "Verdict",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877660/Verdict_rcyhsg.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CLAYMORE,
	},
	{
		key: "a_thousand_floating_dreams",
		name: "A Thousand Floating Dreams",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877669/A_Thousand_Floating_Dreams_jtfd9m.webp",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.CATALYST,
	},
	{
		key: "clamity_queller",
		name: "Clamity Queller",
		iconUrl:
			"https://res.cloudinary.com/dphtvhtvf/image/upload/v1768877687/Calamity_Queller_zmneoj.png",
		rarity: WeaponRarity.WEAPON_NORMAL,
		type: WeaponType.POLEARM,
	},
];
