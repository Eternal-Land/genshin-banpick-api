import { Injectable, OnModuleInit } from "@nestjs/common";
import { Env } from "@utils";
import { v2 as cloudinary } from "cloudinary";
import { GenerateUploadSignatureResponse } from "./dto";
import { Builder } from "builder-pattern";

@Injectable()
export class FilesService implements OnModuleInit {
	onModuleInit() {
		cloudinary.config({
			cloud_name: Env.CLOUDINARY_CLOUD_NAME,
			api_key: Env.CLOUDINARY_API_KEY,
			api_secret: Env.CLOUDINARY_API_SECRET,
		});
	}

	generateUploadSignature(): GenerateUploadSignatureResponse {
		const timestamp = Math.floor(Date.now() / 1000);
		const signature = cloudinary.utils.api_sign_request(
			{
				timestamp: timestamp,
				folder: Env.CLOUDINARY_FOLDER,
			},
			Env.CLOUDINARY_API_SECRET,
		);

		return Builder(GenerateUploadSignatureResponse)
			.signature(signature)
			.folder(Env.CLOUDINARY_FOLDER)
			.apiKey(Env.CLOUDINARY_API_KEY)
			.timestamp(timestamp)
			.cloudName(Env.CLOUDINARY_CLOUD_NAME)
			.build();
	}
}
