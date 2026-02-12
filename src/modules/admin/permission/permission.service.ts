import { PermissionRepository } from "@db/repositories";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PERMISSIONS_MAP } from "@utils/constants";

@Injectable()
export class PermissionService implements OnModuleInit {
	constructor(private readonly permissionRepo: PermissionRepository) {}

	private async initPermissions() {
		const storedPermissions = await this.permissionRepo.find();

		const updatePromises: Promise<any>[] = [];
		const insertPromises: Promise<any>[] = [];
		Object.entries(PERMISSIONS_MAP).forEach(([code, description]) => {
			const storedPermission = storedPermissions.find((p) => p.code === code);
			if (storedPermission) {
				// Update existing permission if description has changed
				if (storedPermission.description !== description) {
					storedPermission.description = description;
				}
				storedPermission.deprecated = false;
				updatePromises.push(this.permissionRepo.save(storedPermission));
			} else {
				// Insert new permission
				const newPermission = this.permissionRepo.create({
					code,
					description,
				});
				insertPromises.push(this.permissionRepo.save(newPermission));
			}
		});

		// Identify deprecated permissions
		const deprecatedIds: number[] = [];

		const permissionCodes = Object.keys(PERMISSIONS_MAP);
		storedPermissions.forEach((p) => {
			if (!permissionCodes.includes(p.code)) {
				deprecatedIds.push(p.id);
			}
		});
		if (deprecatedIds.length > 0) {
			await this.permissionRepo.update(deprecatedIds, { deprecated: true });
		}
	}

	async onModuleInit() {
		await this.initPermissions();
	}

	async listPermissions() {
		return this.permissionRepo.find();
	}
}
