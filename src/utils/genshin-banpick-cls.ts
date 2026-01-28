import { ProfileResponse } from "@modules/self/dto";
import { ClsStore } from "nestjs-cls";

export interface GenshinBanpickCls extends ClsStore {
	profile: ProfileResponse;
}
