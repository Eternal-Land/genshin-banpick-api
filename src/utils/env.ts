import { config } from "dotenv";

config();

export const Env = {
	LISTEN_PORT: Number(process.env.LISTEN_PORT || "0"),
	DB_HOST: process.env.DB_HOST || "",
	DB_PORT: Number(process.env.DB_PORT || "0"),
	DB_NAME: process.env.DB_NAME || "",
	DB_USER: process.env.DB_USER || "",
	DB_PASS: process.env.DB_PASS || "",
	DB_LOGGING: process.env.DB_LOGGING === "true",
	ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === "true",
	JWT_AT_SECRET: process.env.JWT_AT_SECRET || "",
	JWT_AT_EXPIRATION: Number(process.env.JWT_AT_EXPIRATION || "0"),
	ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
	ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
	CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || "",
	HOYOLAB_BASE_URL:
		process.env.HOYOLAB_BASE_URL || "https://sg-public-api.hoyolab.com/event",
	HOYOLAB_LANGUAGE: process.env.HOYOLAB_LANGUAGE || "en-us",
} as const;

console.log(Env);
