import { CostMilestoneEntity } from "@db/entities";
import { ProfileResponse } from "@modules/self/dto";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";

export class CostMilestoneResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	costFrom: number;

	@ApiProperty({ required: false })
	costTo?: number;

	@ApiProperty()
	secPerCost: number;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty({ required: false })
	createdBy?: ProfileResponse;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty({ required: false })
	updatedBy?: ProfileResponse;

	static fromEntity(entity: CostMilestoneEntity) {
		return Builder(CostMilestoneResponse)
			.id(entity.id)
			.costFrom(entity.costFrom)
			.costTo(entity.costTo)
			.secPerCost(entity.secPerCost)
			.createdAt(entity.createdAt)
			.createdBy(
				entity.createdBy
					? ProfileResponse.fromEntity(entity.createdBy)
					: undefined,
			)
			.updatedAt(entity.updatedAt)
			.updatedBy(
				entity.updatedBy
					? ProfileResponse.fromEntity(entity.updatedBy)
					: undefined,
			)
			.build();
	}

	static fromEntities(entities: CostMilestoneEntity[]) {
		return entities.map((entity) => this.fromEntity(entity));
	}
}
