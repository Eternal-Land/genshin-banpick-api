import { AccountRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { GenshinBanpickCls } from "@utils";
import { ClsService } from "nestjs-cls";
import { ProfileResponse, UpdateProfileRequest } from "./dto";
import { SelfProfileNotFoundError } from "./errors";

@Injectable()
export class SelfService {
	constructor(
		private readonly cls: ClsService<GenshinBanpickCls>,
		private readonly accountRepo: AccountRepository,
	) {}

	getSelf() {
		return this.cls.get("profile");
	}

	async updateProfile(dto: UpdateProfileRequest) {
		const accountId = this.cls.get("profile.id");
		const account = await this.accountRepo.findOne({
			where: { id: accountId },
		});
		if (!account) {
			throw new SelfProfileNotFoundError();
		}

		if (dto.displayName !== undefined) {
			account.displayName = dto.displayName;
		}

		if (dto.ingameUuid !== undefined) {
			account.ingameUuid = dto.ingameUuid;
		}

		if (dto.avatar !== undefined) {
			account.avatar = dto.avatar;
		}

		await this.accountRepo.save(account);

		const updated = await this.accountRepo.findOne({
			where: { id: account.id },
			relations: [
				"staffRole",
				"staffRole.permissions",
				"staffRole.permissions.permission",
			],
		});
		if (!updated) {
			throw new SelfProfileNotFoundError();
		}

		const profile = ProfileResponse.fromEntity(updated);
		this.cls.set("profile", profile);
		return profile;
	}
}
