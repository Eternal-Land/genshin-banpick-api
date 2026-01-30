import { Injectable } from "@nestjs/common";
import { Env } from "@utils/env";
import { CharacterListRequest } from "./dto";
import { HoyolabConfigMissingError, HoyolabRequestFailedError } from "./errors";

@Injectable()
export class HoyolabService {
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

		return response.json();
	}
}
