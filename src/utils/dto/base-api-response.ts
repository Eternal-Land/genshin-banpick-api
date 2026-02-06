import { Builder } from "builder-pattern";
import { Type, applyDecorators } from "@nestjs/common";
import {
	ApiExtraModels,
	ApiOkResponse,
	ApiProperty,
	OmitType,
	getSchemaPath,
} from "@nestjs/swagger";
import { ErrorCode } from "../enums/error-code";
import { PaginationDto } from "./pagination.dto";

export class BaseApiResponse<T = any> {
	@ApiProperty({ enum: ErrorCode })
	code: ErrorCode;

	@ApiProperty()
	message: string;

	@ApiProperty({ required: false })
	error?: any;

	@ApiProperty({ required: false })
	data?: T;

	@ApiProperty({ required: false, type: PaginationDto })
	pagination?: PaginationDto;

	@ApiProperty({ required: false })
	next?: any;

	static success<T>(data?: T) {
		return Builder(BaseApiResponse)
			.code(ErrorCode.OK)
			.message("Success")
			.data(data)
			.build();
	}

	static successWithPagination<T>(data: T, pagination: PaginationDto) {
		return Builder(BaseApiResponse)
			.code(ErrorCode.OK)
			.message("Success")
			.data(data)
			.pagination(pagination)
			.build();
	}

	static successWithCursor<T>(data: T, next: any) {
		return Builder(BaseApiResponse)
			.code(ErrorCode.OK)
			.message("Success")
			.data(data)
			.next(next)
			.build();
	}

	static error(code: ErrorCode, message: string, error: any) {
		return Builder(BaseApiResponse)
			.code(code)
			.message(message)
			.error(error)
			.build();
	}
}

interface SwaggerBaseApiResponseOptions {
	isArray?: boolean;
	withPagination?: boolean;
	withCursor?: boolean;
}

export function SwaggerBaseApiResponse<T extends Type<any>>(
	t: T,
	opts?: SwaggerBaseApiResponseOptions,
): MethodDecorator {
	const omitFields: (keyof BaseApiResponse)[] = ["pagination", "next"];

	if (!opts?.withPagination) {
		omitFields.splice(omitFields.indexOf("pagination"), 1);
	}

	if (!opts?.withCursor) {
		omitFields.splice(omitFields.indexOf("next"), 1);
	}

	const swaggerModel = OmitType(BaseApiResponse, omitFields);

	const dataSchema = opts?.isArray
		? {
				type: "array",
				items: {
					type: "object",
					$ref: getSchemaPath(t),
				},
			}
		: {
				type: "object",
				$ref: getSchemaPath(t),
			};

	return applyDecorators(
		ApiExtraModels(swaggerModel, t),
		ApiOkResponse({
			schema: {
				allOf: [
					{ $ref: getSchemaPath(swaggerModel) },
					{
						properties: {
							data: dataSchema,
						},
					},
				],
			},
		}),
	);
}

export function SwaggerBaseApiMessageResponse(): MethodDecorator {
	return applyDecorators(
		ApiExtraModels(BaseApiResponse),
		ApiOkResponse({
			schema: {
				allOf: [
					{ $ref: getSchemaPath(BaseApiResponse) },
					{
						properties: {
							data: {
								type: "object",
								properties: {},
							},
						},
					},
				],
			},
		}),
	);
}
