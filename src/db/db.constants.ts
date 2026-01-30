export const TableNames = {
	Sample: "sample",
	Account: "account",
	StaffRole: "staff_role",
	Permission: "permission",
	StaffRolePermission: "staff_role_permission",
	Character: "character",
};

export const ColumnNames = {
	Global: {
		createdAt: "created_at",
		updatedAt: "updated_at",
		createdById: "created_by_id",
		updatedById: "updated_by_id",
		isActive: "is_active",
	},
	Sample: {
		id: "sample_id",
		name: "sample_name",
		age: "sample_age",
	},
	Account: {
		id: "account_id",
		ingameUuid: "ingame_uuid",
		email: "email",
		displayName: "display_name",
		password: "password",
		lastLoginAt: "last_login_at",
		role: "role",
		avatar: "avatar",
	},
	StaffRole: {
		id: "staff_role_id",
		name: "staff_role_name",
	},
	Permission: {
		id: "permission_id",
		description: "permission_description",
		code: "permission_code",
		deprecated: "permission_deprecated",
	},
	StaffRolePermission: {
		id: "staff_role_permission_id",
	},
	Character: {
		id: "character_id",
		key: "character_key",
		name: "character_name",
		element: "character_element",
		weaponType: "character_weapon_type",
		rarity: "character_rarity",
		iconUrl: "character_icon_url",
	},
};

export const IndexNames = {
	Sample: {
		age: "idx_sample_sample_age",
	},
};
