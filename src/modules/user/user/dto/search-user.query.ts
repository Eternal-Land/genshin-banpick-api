import { ApiProperty } from "@nestjs/swagger";
import { PaginationQuery } from "@utils";

export class SearchUserQuery extends PaginationQuery {
	@ApiProperty({ type: String, required: false })
	search?: string;
}
