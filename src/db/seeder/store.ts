import { AccountEntity } from "@db/entities";

export interface SeedStore {
	adminAccount?: AccountEntity;
}

export const store: SeedStore = {} as const;
