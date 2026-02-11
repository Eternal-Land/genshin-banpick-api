import { CostMilestoneRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { GenshinBanpickCls } from "@utils";
import { ClsService } from "nestjs-cls";
import { CreateCostMilestoneRequest, UpdateCostMilestoneRequest } from "./dto";
import { CostMilestoneNotFoundError } from "./errors";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CostMilestoneService {
	constructor(
		private readonly cls: ClsService<GenshinBanpickCls>,
		private readonly costMilestoneRepo: CostMilestoneRepository,
	) {}

	async listCostMilestones() {
		return await this.costMilestoneRepo.find({
			relations: {
				createdBy: true,
				updatedBy: true,
			},
			order: {
				costFrom: "ASC",
			},
		});
	}

	async getCostMilestone(id: number) {
		const costMilestone = await this.costMilestoneRepo.findOne({
			where: { id },
			relations: {
				createdBy: true,
				updatedBy: true,
			},
		});
		if (!costMilestone) {
			throw new CostMilestoneNotFoundError();
		}
		return costMilestone;
	}

	@Transactional()
	async createCostMilestone(dto: CreateCostMilestoneRequest) {
		const currentAccountId = this.cls.get("profile.id");

		const costMilestone = this.costMilestoneRepo.create({
			costFrom: dto.costFrom,
			costTo: dto.costTo,
			secPerCost: dto.secPerCost,
			createdById: currentAccountId,
		});

		return await this.costMilestoneRepo.save(costMilestone);
	}

	@Transactional()
	async updateCostMilestone(id: number, dto: UpdateCostMilestoneRequest) {
		const costMilestone = await this.getCostMilestone(id);
		const currentAccountId = this.cls.get("profile.id");

		if (dto.costFrom !== undefined) {
			costMilestone.costFrom = dto.costFrom;
		}
		if (dto.costTo !== undefined) {
			costMilestone.costTo = dto.costTo;
		}
		if (dto.secPerCost !== undefined) {
			costMilestone.secPerCost = dto.secPerCost;
		}
		costMilestone.updatedById = currentAccountId;

		return await this.costMilestoneRepo.save(costMilestone);
	}

	@Transactional()
	async deleteCostMilestone(id: number) {
		const costMilestone = await this.getCostMilestone(id);
		return await this.costMilestoneRepo.remove(costMilestone);
	}
}
