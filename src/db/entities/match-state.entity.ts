import { ColumnNames, TableNames } from "@db/db.constants";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity(TableNames.MatchState)
export class MatchStateEntity {
	@PrimaryGeneratedColumn("uuid", { name: ColumnNames.MatchState.id })
	id: string;

	@Column({ name: ColumnNames.Match.id })
	matchId: string;

	@Column({ name: ColumnNames.MatchState.host_joined, default: false })
	hostJoined: boolean;

	@Column({ name: ColumnNames.MatchState.red_player_joined, default: false })
	redPlayerJoined: boolean;

	@Column({ name: ColumnNames.MatchState.blue_player_joined, default: false })
	bluePlayerJoined: boolean;
}
