import { Injectable } from "@nestjs/common";
import { Env } from "@utils/env";
import { CharacterListRequest, CharacterListResponse } from "./dto";
import { HoyolabConfigMissingError, HoyolabRequestFailedError } from "./errors";
import { AccountCharacterRepository } from "@db/repositories/account-character.repository";
import { ClsService } from "nestjs-cls";
import { GenshinBanpickCls } from "@utils";
import { CharacterRepository } from "@db/repositories";

@Injectable()
export class HoyolabService {
	constructor(
		private readonly accountCharacterRepo: AccountCharacterRepository,
		private readonly characterRepo: CharacterRepository,
		private readonly clsService: ClsService<GenshinBanpickCls>,
	) {}

	async getCharacterList(dto: CharacterListRequest) {
		if (!dto.generalCookie || !dto.cookieTokenV2 || !dto.ltokenV2) {
			throw new HoyolabConfigMissingError();
		}

		const cookie = `${dto.generalCookie}; ltoken_v2=${dto.ltokenV2}; cookie_token_v2=${dto.cookieTokenV2};`;

		const payload = {
			role_id: dto.uid,
			server: dto.server,
			sort_type: dto.sortType ?? 1,
		};

		const headers: Record<string, string> = {
			Cookie: cookie,
			"x-rpc-language": dto.language || Env.HOYOLAB_LANGUAGE,
			"x-rpc-lang": dto.language || Env.HOYOLAB_LANGUAGE,
		};

		const url = `${Env.HOYOLAB_BASE_URL}/game_record/genshin/api/character/list`;
		const response = await fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const detail = await response.text();
			throw new HoyolabRequestFailedError({
				status: response.status,
				body: detail,
			});
		}

		return response.json() as Promise<CharacterListResponse>;
	}

	normalizeCharacterName(name: string) {
		return name.toLowerCase().replace(/\s+/g, "_");
	}

	async syncCharacters(dto: CharacterListRequest) {
		const currentProfileId = this.clsService.get("profile.id");

		if (!currentProfileId) {
			throw new Error("No profile ID found in CLS context.");
		}

		const characterList = await this.getCharacterList(dto);

		if (characterList.retcode !== 0) {
			throw new HoyolabRequestFailedError({
				status: characterList.retcode,
				body: characterList.message,
			});
		}

		const accountCharacters = await Promise.all(
			characterList.data.list.map(async (char) => {
				const characterKey = this.normalizeCharacterName(char.name);

				const existingCharacter = await this.characterRepo.findOne({
					where: { key: characterKey },
				});

				if (!existingCharacter) {
					console.log(
						`Character with key ${characterKey} not found in database. Skipping...`,
					);
					return null;
				}

				const existingAccountCharacter =
					await this.accountCharacterRepo.findOne({
						where: {
							accountId: currentProfileId,
							characterId: existingCharacter.id,
						},
					});

				if (existingAccountCharacter) {
					console.log(
						`AccountCharacter for character ${characterKey} already exists. Skipping...`,
					);
					return null;
				}

				const accountCharacter = this.accountCharacterRepo.create({
					accountId: currentProfileId,
					characterId: existingCharacter.id,
					characterLevel: char.level,
					activatedConstellation: char.actived_constellation_num,
					isOwned: true,
					notes: "Synced from Hoyolab",
				});
				return accountCharacter;
			}),
		);

		const toSave = accountCharacters.filter(Boolean);

		if (toSave.length > 0) {
			await this.accountCharacterRepo.save(toSave);
		}

		return toSave;
	}
}
