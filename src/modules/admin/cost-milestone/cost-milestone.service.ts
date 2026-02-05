import { CostMilestoneRepository } from "@db/repositories";
import { Injectable } from "@nestjs/common";
import { GenshinBanpickCls } from "@utils";
import { ClsService } from "nestjs-cls";
import {
	CostMilestoneQuery,
	CreateCostMilestoneRequest,
	UpdateCostMilestoneRequest,
} from "./dto";
import { CostMilestoneNotFoundError } from "./errors";

@Injectable()
export class CostMilestoneService {
	constructor(
		private readonly cls: ClsService<GenshinBanpickCls>,
		private readonly costMilestoneRepo: CostMilestoneRepository,
	) {}

	async listCostMilestones(query: CostMilestoneQuery) {
		const { isActive } = query;

		const queryBuilder = this.costMilestoneRepo
			.createQueryBuilder("costMilestone")
			.leftJoinAndSelect("costMilestone.createdBy", "createdBy")
			.leftJoinAndSelect("costMilestone.updatedBy", "updatedBy");

		if (isActive?.length) {
			queryBuilder.andWhere("costMilestone.isActive IN (:...isActive)", {
				isActive,
			});
		}

		const [costMilestones, total] = await Promise.all([
			queryBuilder
				.orderBy("costMilestone.costFrom", "ASC")
				.skip((query.page - 1) * query.take)
				.take(query.take)
				.getMany(),
			queryBuilder.getCount(),
		]);

		return { costMilestones, total };
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

	async createCostMilestone(dto: CreateCostMilestoneRequest) {
		const currentAccountId = this.cls.get("profile.id");

		const costMilestone = this.costMilestoneRepo.create({
			costFrom: dto.costFrom,
			costTo: dto.costTo,
			costValuePerSec: dto.costValuePerSec,
			createdById: currentAccountId,
		});

		return await this.costMilestoneRepo.save(costMilestone);
	}

	async updateCostMilestone(id: number, dto: UpdateCostMilestoneRequest) {
		const costMilestone = await this.getCostMilestone(id);
		const currentAccountId = this.cls.get("profile.id");

		if (dto.costFrom !== undefined) {
			costMilestone.costFrom = dto.costFrom;
		}
		if (dto.costTo !== undefined) {
			costMilestone.costTo = dto.costTo;
		}
		if (dto.costValuePerSec !== undefined) {
			costMilestone.costValuePerSec = dto.costValuePerSec;
		}
		costMilestone.updatedById = currentAccountId;

		return await this.costMilestoneRepo.save(costMilestone);
	}

	async toggleActive(id: number) {
		const costMilestone = await this.getCostMilestone(id);
		const currentAccountId = this.cls.get("profile.id");

		costMilestone.isActive = !costMilestone.isActive;
		costMilestone.updatedById = currentAccountId;

		return await this.costMilestoneRepo.save(costMilestone);
	}
}
