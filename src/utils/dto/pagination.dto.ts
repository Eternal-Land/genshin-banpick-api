import { ApiProperty } from "@nestjs/swagger";
import { Builder } from "builder-pattern";

export class PaginationDto {
	@ApiProperty()
	page: number;

	@ApiProperty()
	take: number;

	@ApiProperty()
	totalRecord: number;

	@ApiProperty()
	totalPage: number;

	@ApiProperty({ required: false })
	nextPage?: number;

	@ApiProperty({ required: false })
	prevPage?: number;

	static from(page: number, take: number, total: number) {
		return Builder(PaginationDto)
			.page(page)
			.take(take)
			.totalRecord(total)
			.totalPage(Math.ceil(total / take))
			.nextPage(page * take < total ? page + 1 : undefined)
			.prevPage(page > 1 ? page - 1 : undefined)
			.build();
	}
}
