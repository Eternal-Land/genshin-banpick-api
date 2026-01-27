import { Controller, Get } from "@nestjs/common";
import { SkipAuth } from "@utils/decorators";
import { FilesService } from "./files.service";
import { BaseApiResponse, SwaggerBaseApiResponse } from "@utils";
import { GenerateUploadSignatureResponse } from "./dto";

@Controller("/files")
@SkipAuth()
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get("upload-signature")
	@SwaggerBaseApiResponse(GenerateUploadSignatureResponse)
	async generateUploadSignature() {
		const response = this.filesService.generateUploadSignature();
		return BaseApiResponse.success(response);
	}
}
