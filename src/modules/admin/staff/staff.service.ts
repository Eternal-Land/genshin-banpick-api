import { AccountRepository, StaffRoleRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { CreateStaffRequest, UpdateStaffRequest } from "./dto";
import {
	StaffEmailAlreadyExistsError,
	StaffNotFoundError,
	StaffRoleNotFoundError,
} from "./errors";
import { AccountRole } from "@utils/enums";
import { ClsService } from "nestjs-cls";
import { GenshinBanpickCls } from "@utils";
import * as bcrypt from "bcryptjs";

@Injectable()
export class StaffService {
	constructor(
		private readonly accountRepo: AccountRepository,
		private readonly staffRoleRepo: StaffRoleRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
	) {}

	async listStaff() {
		return this.accountRepo.find({
			where: { role: AccountRole.STAFF },
			relations: {
				staffRole: true,
				createdBy: true,
			},
			order: { createdAt: "DESC" },
		});
	}

	async getStaff(id: string) {
		const staff = await this.accountRepo.findOne({
			where: { id, role: AccountRole.STAFF },
			relations: {
				staffRole: true,
				createdBy: true,
			},
		});
		if (!staff) {
			throw new StaffNotFoundError();
		}
		return staff;
	}

	async createStaff(dto: CreateStaffRequest) {
		const existing = await this.accountRepo.findOne({
			where: { email: dto.email },
		});
		if (existing) {
			throw new StaffEmailAlreadyExistsError();
		}

		const staffRole = await this.staffRoleRepo.findOne({
			where: { id: dto.staffRoleId },
		});
		if (!staffRole) {
			throw new StaffRoleNotFoundError();
		}

		const hashedPassword = await bcrypt.hash(dto.password, 10);
		const currentAccountId = this.cls.get("profile.id");

		const staff = this.accountRepo.create({
			ingameUuid: dto.ingameUuid,
			email: dto.email,
			displayName: dto.displayName,
			password: hashedPassword,
			role: AccountRole.STAFF,
			staffRoleId: dto.staffRoleId,
			createdById: currentAccountId,
			avatar: dto.avatar,
		});

		const saved = await this.accountRepo.save(staff);

		return this.accountRepo.findOne({
			where: { id: saved.id },
			relations: {
				staffRole: true,
				createdBy: true,
			},
		});
	}

	async updateStaff(id: string, dto: UpdateStaffRequest) {
		const staff = await this.accountRepo.findOne({
			where: { id, role: AccountRole.STAFF },
		});
		if (!staff) {
			throw new StaffNotFoundError();
		}

		if (dto.email !== undefined) {
			const existing = await this.accountRepo.findOne({
				where: { email: dto.email },
			});
			if (existing && existing.id !== staff.id) {
				throw new StaffEmailAlreadyExistsError();
			}
			staff.email = dto.email;
		}

		if (dto.displayName !== undefined) {
			staff.displayName = dto.displayName;
		}

		if (dto.ingameUuid !== undefined) {
			staff.ingameUuid = dto.ingameUuid;
		}

		if (dto.avatar !== undefined) {
			staff.avatar = dto.avatar;
		}

		if (dto.staffRoleId !== undefined) {
			const role = await this.staffRoleRepo.findOne({
				where: { id: dto.staffRoleId },
			});
			if (!role) {
				throw new StaffRoleNotFoundError();
			}
			staff.staffRoleId = dto.staffRoleId;
		}

		await this.accountRepo.save(staff);

		return this.accountRepo.findOne({
			where: { id: staff.id },
			relations: {
				staffRole: true,
				createdBy: true,
			},
		});
	}

	async toggleActive(id: string) {
		const staff = await this.accountRepo.findOne({
			where: { id, role: AccountRole.STAFF },
		});
		if (!staff) {
			throw new StaffNotFoundError();
		}

		staff.isActive = !staff.isActive;
		await this.accountRepo.save(staff);

		return this.accountRepo.findOne({
			where: { id: staff.id },
			relations: {
				staffRole: true,
				createdBy: true,
			},
		});
	}
}
