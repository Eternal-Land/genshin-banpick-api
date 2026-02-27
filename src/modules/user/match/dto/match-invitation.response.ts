import { MatchInvitationEntity } from "@db/entities";
import { Builder } from "builder-pattern";

export class MatchInvitationResponse {
	invitationId: string;
	matchName: string;
	inviterDisplayName: string;
	inviterAvatarUrl: string;

	static fromEntity(invitation: MatchInvitationEntity) {
		return Builder(MatchInvitationResponse)
			.invitationId(invitation.id)
			.matchName(invitation.match?.name)
			.inviterDisplayName(invitation.account?.displayName)
			.inviterAvatarUrl(invitation.account?.avatar)
			.build();
	}
}
