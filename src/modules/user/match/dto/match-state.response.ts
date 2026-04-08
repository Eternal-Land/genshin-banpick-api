import { MatchStateEntity } from "@db/entities";
import { PlayerSide } from "@utils/enums";
import { Builder } from "builder-pattern";

export class MatchStateResponse {
	hostJoined: boolean;
	redPlayerJoined: boolean;
	bluePlayerJoined: boolean;
	currentSession: number;
	currentTurn: PlayerSide;
	blueBanChars: string[];
	blueSelectedChars: string[];
	blueSelectedWeapons: string[];
	blueSelectedWeaponRefinements: number[];
	redBanChars: string[];
	redSelectedChars: string[];
	redSelectedWeapons: string[];
	redSelectedWeaponRefinements: number[];
	updatedAt: Date;

	static fromEntity(entity: MatchStateEntity): MatchStateResponse {
		const matchState = entity as MatchStateEntity & {
			blueSelectedWeaponRefinements?: number[];
			redSelectedWeaponRefinements?: number[];
		};

		return Builder(MatchStateResponse)
			.hostJoined(entity.hostJoined)
			.redPlayerJoined(entity.redPlayerJoined)
			.bluePlayerJoined(entity.bluePlayerJoined)
			.currentSession(entity.currentSession)
			.currentTurn(entity.currentTurn)
			.blueBanChars(entity.blueBanChars)
			.blueSelectedChars(entity.blueSelectedChars)
			.blueSelectedWeapons(entity.blueSelectedWeapons)
			.blueSelectedWeaponRefinements(
				matchState.blueSelectedWeaponRefinements ?? [],
			)
			.redBanChars(entity.redBanChars)
			.redSelectedChars(entity.redSelectedChars)
			.redSelectedWeapons(entity.redSelectedWeapons)
			.redSelectedWeaponRefinements(
				matchState.redSelectedWeaponRefinements ?? [],
			)
			.updatedAt(entity.updatedAt)
			.build();
	}
}
