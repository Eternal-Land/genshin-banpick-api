import { AccountRepository } from "@db/repositories";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Builder } from "builder-pattern";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Env } from "@utils/env";
import { BasicLoginRequest, RegisterRequest, TokenResponse } from "./dto";
import { AccountAlreadyExistsError, InvalidCredentialsError } from "./errors";
import { ClsService } from "nestjs-cls";
import { GenshinBanpickCls } from "@utils";
import { AccountRole } from "@utils/enums";

@Injectable()
export class AuthService implements OnModuleInit {
	constructor(
		private readonly accountRepo: AccountRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
	) {}

	private async initAdminAccount() {
		const admin = await this.accountRepo.findOne({
			where: { email: Env.ADMIN_EMAIL },
		});

		if (!admin) {
			const hashedPassword = await bcrypt.hash(Env.ADMIN_PASSWORD, 10);
			const account = this.accountRepo.create({
				email: Env.ADMIN_EMAIL,
				displayName: "Administrator",
				password: hashedPassword,
				role: AccountRole.ADMIN,
			});

			await this.accountRepo.save(account);
		}
	}

	async onModuleInit() {
		await this.initAdminAccount();
	}

	async register(dto: RegisterRequest) {
		const existing = await this.accountRepo.findOne({
			where: [{ email: dto.email }, { ingameUuid: dto.ingameUuid }],
		});

		if (existing) {
			throw new AccountAlreadyExistsError();
		}

		const hashedPassword = await bcrypt.hash(dto.password, 10);

		const account = this.accountRepo.create({
			ingameUuid: dto.ingameUuid,
			email: dto.email,
			displayName: dto.displayName,
			password: hashedPassword,
			avatar: dto.avatar,
		});

		await this.accountRepo.save(account);
	}

	async loginBasic(dto: BasicLoginRequest): Promise<TokenResponse> {
		const account = await this.accountRepo.findOne({
			where: [
				{ email: dto.ingameUuidOrEmail },
				{ ingameUuid: dto.ingameUuidOrEmail },
			],
		});

		if (!account) {
			throw new InvalidCredentialsError();
		}

		const isValidPassword = await bcrypt.compare(
			dto.password,
			account.password,
		);
		if (!isValidPassword) {
			throw new InvalidCredentialsError();
		}

		await this.accountRepo.update(
			{ id: account.id },
			{ lastLoginAt: new Date() },
		);

		const accessToken = jwt.sign(
			{ sub: account.id, email: account.email, role: account.role },
			Env.JWT_AT_SECRET,
			{
				expiresIn: Env.JWT_AT_EXPIRATION || undefined,
			},
		);

		return Builder(TokenResponse).accessToken(accessToken).build();
	}
}
