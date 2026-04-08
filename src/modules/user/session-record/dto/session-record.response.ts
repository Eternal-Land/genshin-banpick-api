import { SessionRecordEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";

export class SessionRecordResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty({ nullable: true })
	createdBy: string;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty({ nullable: true })
	updatedBy: string;

	@ApiProperty()
	isDeleted: boolean;

	@ApiProperty()
	matchSessionId: number;

	@ApiProperty()
	blueChamber1: number;

	@ApiProperty()
	blueChamber2: number;

	@ApiProperty()
	blueChamber3: number;

	@ApiProperty()
	blueResetTimes: number;

	@ApiProperty()
	blueFinalTime: number;

	@ApiProperty()
	redChamber1: number;

	@ApiProperty()
	redChamber2: number;

	@ApiProperty()
	redChamber3: number;

	@ApiProperty()
	redResetTimes: number;

	@ApiProperty()
	redFinalTime: number;

	static fromEntity(entity: SessionRecordEntity) {
		return Builder(SessionRecordResponse)
			.id(entity.id)
			.createdAt(entity.createdAt)
			.createdBy(entity.createdBy)
			.updatedAt(entity.updatedAt)
			.updatedBy(entity.updatedBy)
			.isDeleted(entity.isDeleted)
			.matchSessionId(entity.matchSessionId)
			.blueChamber1(entity.blueChamber1)
			.blueChamber2(entity.blueChamber2)
			.blueChamber3(entity.blueChamber3)
			.blueResetTimes(entity.blueResetTimes)
			.blueFinalTime(entity.blueFinalTime)
			.redChamber1(entity.redChamber1)
			.redChamber2(entity.redChamber2)
			.redChamber3(entity.redChamber3)
			.redResetTimes(entity.redResetTimes)
			.redFinalTime(entity.redFinalTime)
			.build();
	}
}
