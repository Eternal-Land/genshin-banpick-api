import { AccountRepository, StaffRoleRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { CreateStaffRequest, UpdateStaffRequest } from "./dto";
import {
	StaffEmailAlreadyExistsError,
	StaffNotFoundError,
	StaffRoleNotFoundError,
} from "./errors";
import { AccountRole } from "@utils/enums";
import * as bcrypt from "bcryptjs";

@Injectable()
export class StaffService {
	constructor(
		private readonly accountRepo: AccountRepository,
		private readonly staffRoleRepo: StaffRoleRepository,
	) {}

	async listStaff() {
		return this.accountRepo.find({
			where: { role: AccountRole.STAFF },
			relations: ["staffRole"],
			order: { createdAt: "DESC" },
		});
	}

	async getStaff(id: string) {
		const staff = await this.accountRepo.findOne({
			where: { id, role: AccountRole.STAFF },
			relations: ["staffRole"],
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

		const staff = this.accountRepo.create({
			ingameUuid: dto.ingameUuid,
			email: dto.email,
			displayName: dto.displayName,
			password: hashedPassword,
			role: AccountRole.STAFF,
			staffRoleId: dto.staffRoleId,
		});

		const saved = await this.accountRepo.save(staff);

		return this.accountRepo.findOne({
			where: { id: saved.id },
			relations: ["staffRole"],
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

		if (dto.password !== undefined) {
			staff.password = await bcrypt.hash(dto.password, 10);
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
			relations: ["staffRole"],
		});
	}

	async deleteStaff(id: string) {
		const staff = await this.accountRepo.findOne({
			where: { id, role: AccountRole.STAFF },
		});
		if (!staff) {
			throw new StaffNotFoundError();
		}

		await this.accountRepo.delete({ id: staff.id });
	}
}
