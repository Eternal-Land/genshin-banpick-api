export const SocketEvents = {
	ERROR: "error",
	NOTIFICATION: "notification",
	JOIN_MATCH_ROOM: "join_match_room",
	LEAVE_MATCH_ROOM: "leave_match_room",
	MATCH_DELETED: "match_deleted",
	UPDATE_MATCH_STATE: "update_match_state",
	UPDATE_MATCH_SESSION: "update_match_session",
	MATCH_STARTED: "match_started",
	MATCH_COMPLETED: "match_completed",
	MATCH_UPDATED: "match_updated",
} as const;
