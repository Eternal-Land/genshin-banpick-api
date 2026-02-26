import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Env, MyExceptionFilter } from "@utils";
import helmet from "helmet";
import { initializeTransactionalContext } from "typeorm-transactional";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ApiValidationError } from "@errors";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import * as cookieParser from "cookie-parser";

dayjs.extend(utc);
dayjs.extend(timezone);

function setupCors(app: INestApplication<any>) {
	const origins = Env.CORS_ORIGINS.split(",").map((origin) => origin.trim());
	app.enableCors({
		origin: origins,
		credentials: true,
	});
}

async function bootstrap() {
	initializeTransactionalContext();

	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix("/api");
	setupCors(app);
	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory: (errors) => new ApiValidationError(errors),
		}),
	);
	app.useGlobalFilters(new MyExceptionFilter());

	if (Env.ENABLE_SWAGGER) {
		const config = new DocumentBuilder()
			.setTitle("API Documentation")
			.setDescription("API Description")
			.setVersion("1.0")
			.addBearerAuth()
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup("api/docs", app, document);
	}
	app.use(helmet());

	await app.listen(Env.LISTEN_PORT);
}
bootstrap();
