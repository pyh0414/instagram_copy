import gql from "graphql-tag";

import { fullRoomInfo, fullChatInfo } from "../fragment";

const SUBSCRIPTION_CREATE_ROOM = gql`
	subscription {
		createRoomEvent {
			...full_room_info
		}
	}
	${fullRoomInfo}
`;

const SUBSCRIPTION_REMOVE_ROOM = gql`
	subscription {
		removeRoomEvent {
			...full_room_info
		}
	}
	${fullRoomInfo}
`;

const SUBSCRIPTION_CREATE_CHAT = gql`
	subscription {
		createChatEvent {
			...full_chat_info
		}
	}
	${fullChatInfo}
`;

export {
	SUBSCRIPTION_CREATE_ROOM,
	SUBSCRIPTION_REMOVE_ROOM,
	SUBSCRIPTION_CREATE_CHAT,
};
