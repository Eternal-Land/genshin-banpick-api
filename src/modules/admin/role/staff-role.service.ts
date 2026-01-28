import {
	StaffRolePermissionRepository,
	StaffRoleRepository,
} from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { CreateStaffRoleRequest, UpdateStaffRoleRequest } from "./dto";
import { RoleNotFoundError } from "./errors";
import { ClsService } from "nestjs-cls";
import { GenshinBanpickCls } from "@utils";

@Injectable()
export class StaffRoleService {
	constructor(
		private readonly roleRepo: StaffRoleRepository,
		private readonly rolePermissionRepo: StaffRolePermissionRepository,
		private readonly cls: ClsService<GenshinBanpickCls>,
	) {}

	async listRoles() {
		return this.roleRepo.find({
			order: { id: "ASC" },
			relations: {
				permissions: {
					permission: true,
				},
				createdBy: true,
				updatedBy: true,
			},
		});
	}

	async getStaffRole(id: number) {
		const role = await this.roleRepo.findOne({
			where: { id },
			relations: {
				permissions: {
					permission: true,
				},
				createdBy: true,
				updatedBy: true,
			},
		});
		if (!role) {
			throw new RoleNotFoundError();
		}
		return role;
	}

	async createRole(dto: CreateStaffRoleRequest) {
		const permissionIds = dto.permissionIds ?? [];
		const currentAccountId = this.cls.get("profile.id");

		const role = this.roleRepo.create({
			name: dto.name,
			createdById: currentAccountId,
			updatedById: currentAccountId,
		});

		const savedRole = await this.roleRepo.save(role);

		if (permissionIds.length) {
			const rolePermissions = permissionIds.map((permissionId) =>
				this.rolePermissionRepo.create({
					staffRoleId: savedRole.id,
					permissionId,
				}),
			);
			await this.rolePermissionRepo.save(rolePermissions);
		}

		const savedRoleWithPermissions = await this.roleRepo.findOne({
			where: { id: savedRole.id },
			relations: {
				permissions: {
					permission: true,
				},
				createdBy: true,
				updatedBy: true,
			},
		});

		return savedRoleWithPermissions ?? savedRole;
	}

	async updateRole(id: number, dto: UpdateStaffRoleRequest) {
		const role = await this.roleRepo.findOne({ where: { id } });
		if (!role) {
			throw new RoleNotFoundError();
		}
		const currentAccountId = this.cls.get("profile.id");

		if (dto.name !== undefined) {
			role.name = dto.name;
		}
		role.updatedById = currentAccountId;

		const savedRole = await this.roleRepo.save(role);

		if (dto.permissionIds) {
			await this.rolePermissionRepo.delete({ staffRoleId: id });
			if (dto.permissionIds.length) {
				const rolePermissions = dto.permissionIds.map((permissionId) =>
					this.rolePermissionRepo.create({
						staffRoleId: id,
						permissionId,
					}),
				);
				await this.rolePermissionRepo.save(rolePermissions);
			}
		}

		const savedRoleWithPermissions = await this.roleRepo.findOne({
			where: { id: savedRole.id },
			relations: {
				permissions: {
					permission: true,
				},
				createdBy: true,
				updatedBy: true,
			},
		});

		return savedRoleWithPermissions ?? savedRole;
	}

	async copyRole(id: number) {
		const role = await this.roleRepo.findOne({
			where: { id },
			relations: ["permissions", "permissions.permission"],
		});
		if (!role) {
			throw new RoleNotFoundError();
		}

		const currentAccountId = this.cls.get("profile.id");
		const newRole = this.roleRepo.create({
			name: role.name,
			isActive: role.isActive,
			createdById: currentAccountId,
			updatedById: currentAccountId,
		});

		const savedRole = await this.roleRepo.save(newRole);

		const permissionIds = role.permissions?.map((p) => p.permissionId) ?? [];
		if (permissionIds.length) {
			const rolePermissions = permissionIds.map((permissionId) =>
				this.rolePermissionRepo.create({
					staffRoleId: savedRole.id,
					permissionId,
				}),
			);
			await this.rolePermissionRepo.save(rolePermissions);
		}

		const savedRoleWithPermissions = await this.roleRepo.findOne({
			where: { id: savedRole.id },
			relations: {
				permissions: {
					permission: true,
				},
				createdBy: true,
				updatedBy: true,
			},
		});

		return savedRoleWithPermissions ?? savedRole;
	}

	async toggleRoleActive(id: number) {
		const role = await this.roleRepo.findOne({ where: { id } });
		if (!role) {
			throw new RoleNotFoundError();
		}

		const currentAccountId = this.cls.get("profile.id");
		role.isActive = !role.isActive;
		role.updatedById = currentAccountId;

		const savedRole = await this.roleRepo.save(role);

		const savedRoleWithPermissions = await this.roleRepo.findOne({
			where: { id: savedRole.id },
			relations: {
				permissions: {
					permission: true,
				},
				createdBy: true,
				updatedBy: true,
			},
		});

		return savedRoleWithPermissions ?? savedRole;
	}
}
