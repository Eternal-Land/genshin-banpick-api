import { MatchRepository } from "@db/repositories";
import { CanActivate, ExecutionContext } from "@nestjs/common";

export class MatchGuard implements CanActivate {
	constructor(private readonly matchRepository: MatchRepository) {}

	async canActivate(context: ExecutionContext) {
		return true;
	}
}
