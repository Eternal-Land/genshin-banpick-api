import { NotificationEntity } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
	constructor(datasource: DataSource) {
		super(NotificationEntity, datasource.createEntityManager());
	}
}
