import gql from "graphql-tag";

import { fullRoomInfo } from "../fragment";

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

export { SUBSCRIPTION_CREATE_ROOM, SUBSCRIPTION_REMOVE_ROOM };
