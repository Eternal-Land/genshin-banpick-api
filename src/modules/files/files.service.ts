import { Injectable, OnModuleInit } from "@nestjs/common";
import { Env } from "@utils";
import { v2 as cloudinary } from "cloudinary";
import { GenerateUploadSignatureResponse } from "./dto";
import { Builder } from "builder-pattern";

@Injectable()
export class FilesService implements OnModuleInit {
	onModuleInit() {
		if (
			!Env.CLOUDINARY_CLOUD_NAME ||
			!Env.CLOUDINARY_API_KEY ||
			!Env.CLOUDINARY_API_SECRET
		) {
			throw new Error("Cloudinary environment variables are not configured");
		}

		cloudinary.config({
			cloud_name: Env.CLOUDINARY_CLOUD_NAME,
			api_key: Env.CLOUDINARY_API_KEY,
			api_secret: Env.CLOUDINARY_API_SECRET,
		});
	}

	generateUploadSignature(folder: string): GenerateUploadSignatureResponse {
		const normalizedFolder = folder.trim();
		const timestamp = Math.floor(Date.now() / 1000);
		const signature = cloudinary.utils.api_sign_request(
			{
				timestamp: timestamp,
				folder: normalizedFolder,
			},
			Env.CLOUDINARY_API_SECRET,
		);

		return Builder(GenerateUploadSignatureResponse)
			.signature(signature)
			.folder(normalizedFolder)
			.apiKey(Env.CLOUDINARY_API_KEY)
			.timestamp(timestamp)
			.cloudName(Env.CLOUDINARY_CLOUD_NAME)
			.build();
	}
}
