export const TableNames = {
	Sample: "sample",
	Account: "account",
	AccountCharacter: "account_character",
	StaffRole: "staff_role",
	Permission: "permission",
	StaffRolePermission: "staff_role_permission",
	Character: "character",
	Weapon: "weapon",
	CharacterCost: "character_cost",
	CostMilestone: "cost_milestone",
	WeaponCost: "weapon_cost",
	WeaponCostMilestone: "weapon_cost_milestone",
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
	AccountCharacter: {
		id: "account_character_id",
		accountId: "account_id",
		characterId: "character_id",
		activatedConstellation: "activated_constellation",
		characterLevel: "character_level",
		isOwned: "is_owned",
		notes: "notes",
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
	Weapon: {
		id: "weapon_id",
		key: "weapon_key",
		name: "weapon_name",
		type: "weapon_type",
		rarity: "weapon_rarity",
		iconUrl: "weapon_icon_url",
	},
	CharacterCost: {
		id: "character_cost_id",
		cost: "character_cost",
		constellation: "character_constellation",
	},
	CostMilestone: {
		id: "cost_milestone_id",
		costFrom: "cost_from",
		costTo: "cost_to",
		costValuePerSec: "cost_value_per_sec",
	},
	WeaponCost: {
		id: "weapon_cost_id",
		cost: "weapon_cost",
		addTime: "add_time",
		upgradeLevel: "upgrade_level",
	},
	WeaponCostMilestone: {
		id: "weapon_cost_milestone_id",
		weapon_rarity: "weapon_rarity",
		cost: "cost",
		addTime: "add_time",
		upgradeLevel: "upgrade_level",
	},
};

export const IndexNames = {
	Sample: {
		age: "idx_sample_sample_age",
	},
	Account: {
		role: "idx_account_role",
		isActive: "idx_account_is_active",
		roleIsActive: "idx_account_role_is_active",
		ingameUuid: "idx_account_ingame_uuid",
	},
	AccountCharacter: {
		accountIdCharacterId: "idx_account_character_account_id_character_id",
		characterId: "idx_account_character_character_id",
	},
	Character: {
		element: "idx_character_element",
		weaponType: "idx_character_weapon_type",
		rarity: "idx_character_rarity",
		isActive: "idx_character_is_active",
	},
	Weapon: {
		type: "idx_weapon_type",
		rarity: "idx_weapon_rarity",
		isActive: "idx_weapon_is_active",
	},
	StaffRole: {
		isActive: "idx_staff_role_is_active",
	},
	StaffRolePermission: {
		staffRoleId: "idx_staff_role_permission_staff_role_id",
		permissionId: "idx_staff_role_permission_permission_id",
		staffRolePermission: "idx_staff_role_permission_composite",
	},
	Permission: {
		deprecated: "idx_permission_deprecated",
	},
};
