import { MatchEntity } from "@db/entities";
import { MatchRepository, MatchStateRepository } from "@db/repositories";
import { SocketMatchService } from "@modules/socket/services";
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CustomCronExpression, SocketEvents } from "@utils/constants";
import { MatchStatus } from "@utils/enums";
import * as dayjs from "dayjs";
import { Transactional } from "typeorm-transactional";
import { In, LessThanOrEqual } from "typeorm";

@Injectable()
export class CronService {
	private readonly logger = new Logger(CronService.name);

	constructor(
		private readonly matchRepository: MatchRepository,
		private readonly matchStateRepository: MatchStateRepository,
		private readonly socketMatchService: SocketMatchService,
	) {}

	@Cron(CustomCronExpression.EVERY_15_MINUTES)
	async handleCleanMatch() {
		const past = dayjs().subtract(15, "minute").toDate();
		console.log("Check for outdated matches at:", past);
		const outdatedMatches = await this.matchRepository.find({
			where: {
				status: In([MatchStatus.WAITING, MatchStatus.LIVE]),
				matchState: {
					updatedAt: LessThanOrEqual(past),
				},
			},
			relations: {
				matchState: true,
			},
		});

		console.log(
			"Outdated matches found:",
			JSON.stringify(outdatedMatches, null, 2),
		);

		const cleanupResults = await Promise.allSettled(
			outdatedMatches.map((match) => this.handleExpireMatch(match)),
		);

		cleanupResults.forEach((result, index) => {
			if (result.status === "rejected") {
				const matchId = outdatedMatches[index]?.id ?? "unknown";
				this.logger.error(
					`Failed to expire outdated match ${matchId}`,
					result.reason instanceof Error
						? result.reason.stack
						: String(result.reason),
				);
			}
		});
	}

	@Transactional()
	private async handleExpireMatch(match: MatchEntity) {
		let isMatchDeleted = false;
		if (match.status == MatchStatus.WAITING) {
			await Promise.all([
				this.matchRepository.delete(match.id),
				this.matchStateRepository.delete({ matchId: match.id }),
			]);
			isMatchDeleted = true;
		} else if (match.status == MatchStatus.LIVE) {
			const state = await this.matchStateRepository.findOne({
				where: { matchId: match.id },
			});
			if (!state) {
				await this.matchRepository.update(match.id, {
					status: MatchStatus.CANCELLED,
				});
				isMatchDeleted = true;
			} else if (
				!state.hostJoined &&
				!state.bluePlayerJoined &&
				!state.redPlayerJoined
			) {
				await Promise.all([
					this.matchRepository.update(match.id, {
						status: MatchStatus.CANCELLED,
					}),
					this.matchStateRepository.delete({ matchId: match.id }),
				]);
				isMatchDeleted = true;
			}
		}

		if (isMatchDeleted) {
			this.socketMatchService.emitToMatch(
				match.id,
				SocketEvents.MATCH_DELETED,
				match.id,
			);
		}
	}
}
