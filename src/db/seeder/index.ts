import { NestFactory } from "@nestjs/core";
import { SeederModule } from "./seeder.module";
import { initializeTransactionalContext } from "typeorm-transactional";
import { SeederService } from "./services";

async function main() {
	initializeTransactionalContext();
	const app = await NestFactory.create(SeederModule);
	const seederService = app.get(SeederService);
	await seederService.seed();
	await app.close();
}

main();
