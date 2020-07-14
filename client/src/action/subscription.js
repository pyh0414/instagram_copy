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

export { SUBSCRIPTION_CREATE_ROOM };
