import { AccountRepository } from "@db/repositories";
import { ApiError } from "@errors";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { ClsService } from "nestjs-cls";
import { GenshinBanpickCls } from "@utils";
import { Env } from "@utils/env";
import { REQUIRE_PERMISSION_KEY, SKIP_AUTH_KEY } from "@utils/decorators";
import {
	AccountInactiveError,
	InvalidCredentialsError,
	PermissionDeniedError,
	StaffRoleInactiveError,
} from "./errors";
import { AccountRole } from "@utils/enums";
import { ProfileResponse } from "@modules/self/dto";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly accountRepo: AccountRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (skipAuth) {
			return true;
		}

		const token = this.getTokenFromRequest(req);
		if (!token) {
			throw new InvalidCredentialsError();
		}

		try {
			const payload = jwt.verify(token, Env.JWT_AT_SECRET) as jwt.JwtPayload;
			const accountId = payload?.sub as string | undefined;
			if (!accountId) {
				throw new InvalidCredentialsError();
			}

			const account = await this.accountRepo.findOne({
				where: { id: accountId },
				relations: [
					"staffRole",
					"staffRole.permissions",
					"staffRole.permissions.permission",
				],
			});
			if (!account) {
				throw new InvalidCredentialsError();
			}

			if (!account.isActive) {
				throw new AccountInactiveError();
			}

			const requiredPermission = this.reflector.getAllAndOverride<string>(
				REQUIRE_PERMISSION_KEY,
				[context.getHandler()],
			);

			if (requiredPermission) {
				if (account.role == AccountRole.ADMIN) {
					this.cls.set("profile", ProfileResponse.fromEntity(account));
					return true;
				}

				if (!account.staffRole || !account.staffRole.isActive) {
					throw new StaffRoleInactiveError();
				}

				const permissions =
					account.staffRole.permissions?.map((p) => p.permission?.code) ?? [];
				const hasPermission = permissions.includes(requiredPermission);
				if (!hasPermission) {
					throw new PermissionDeniedError();
				}
			}

			this.cls.set("profile", ProfileResponse.fromEntity(account));
			return true;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new InvalidCredentialsError();
		}
	}

	private getTokenFromRequest(req: Request): string | undefined {
		return req.headers["authorization"]?.replace("Bearer ", "");
	}
}
