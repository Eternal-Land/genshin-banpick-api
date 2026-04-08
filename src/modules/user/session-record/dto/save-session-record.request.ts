import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class SaveSessionRecordRequest {
	@ApiProperty({ minimum: 0 })
	@IsInt()
	@Min(0)
	blueChamber1: number;

	@ApiProperty({ minimum: 0 })
	@IsInt()
	@Min(0)
	blueChamber2: number;

	@ApiProperty({ minimum: 0 })
	@IsInt()
	@Min(0)
	blueChamber3: number;

	@ApiProperty({ minimum: 0 })
	@IsInt()
	@Min(0)
	blueResetTimes: number;

	@ApiProperty({ minimum: 0 })
	@IsInt()
	@Min(0)
	blueFinalTime: number;

	@ApiProperty({ minimum: 0 })
	@IsInt()
	@Min(0)
	redChamber1: number;

	@ApiProperty({ minimum: 0 })
	@IsInt()
	@Min(0)
	redChamber2: number;

	@ApiProperty({ minimum: 0 })
	@IsInt()
	@Min(0)
	redChamber3: number;

	@ApiProperty({ minimum: 0 })
	@IsInt()
	@Min(0)
	redResetTimes: number;

	@ApiProperty({ minimum: 0 })
	@IsInt()
	@Min(0)
	redFinalTime: number;
}
