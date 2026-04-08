import { ColumnNames, TableNames } from "@db/db.constants";
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { IndexNames } from "@db/db.constants";
import { PlayerSide } from "@utils/enums";
import { MatchEntity } from "./match.entity";

@Entity(TableNames.MatchState)
@Index(IndexNames.MatchState.matchId, ["matchId"], { unique: true })
export class MatchStateEntity {
	@PrimaryGeneratedColumn("uuid", { name: ColumnNames.MatchState.id })
	id: string;

	@Column({ name: ColumnNames.Match.id })
	matchId: string;

	@OneToOne(() => MatchEntity, (match) => match.matchState, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({ name: ColumnNames.Match.id })
	match: MatchEntity;

	@Column({ name: ColumnNames.MatchState.host_joined, default: false })
	hostJoined: boolean;

	@Column({ name: ColumnNames.MatchState.red_player_joined, default: false })
	redPlayerJoined: boolean;

	@Column({ name: ColumnNames.MatchState.blue_player_joined, default: false })
	bluePlayerJoined: boolean;

	@Column({ name: ColumnNames.MatchState.currentSession, default: 0 })
	currentSession: number;

	@Column({
		name: ColumnNames.MatchState.currentTurn,
		type: "int",
		default: PlayerSide.BLUE,
	})
	currentTurn: PlayerSide;

	@Column({ name: ColumnNames.MatchState.blueBanChars, type: "simple-array" })
	blueBanChars: string[];

	@Column({
		name: ColumnNames.MatchState.blueSelectedChars,
		type: "simple-array",
	})
	blueSelectedChars: string[];

	@Column({
		name: ColumnNames.MatchState.blueSelectedWeapons,
		type: "simple-array",
	})
	blueSelectedWeapons: string[];

	@Column({ name: ColumnNames.MatchState.redBanChars, type: "simple-array" })
	redBanChars: string[];

	@Column({
		name: ColumnNames.MatchState.redSelectedChars,
		type: "simple-array",
	})
	redSelectedChars: string[];

	@Column({
		name: ColumnNames.MatchState.redSelectedWeapons,
		type: "simple-array",
	})
	redSelectedWeapons: string[];

	@UpdateDateColumn({ name: ColumnNames.Global.updatedAt, type: "datetime" })
	updatedAt: Date;
}
