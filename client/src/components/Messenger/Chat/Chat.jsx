import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { CLIENT_LOGGED_IN_USER } from "../../../action/client";

import ChatItem from "./ChatItem";
import Foot from "./Foot";

const Chat = ({ allRooms, onLeaveRoom, currentRoomId }) => {
	const { data } = useQuery(CLIENT_LOGGED_IN_USER);

	const currentRoom = allRooms.find((v) => v.id === currentRoomId);

	return (
		<>
			<div style={{ height: "93%", overflow: "scroll" }}>
				{currentRoom.chats.map((v, i) => {
					return <ChatItem chat={v} key={i} loggedInUser={data.user} />;
				})}
			</div>
			<Foot
				onLeaveRoom={onLeaveRoom}
				currentRoomId={currentRoomId}
				allRooms={allRooms}
			/>
		</>
	);
};

export default Chat;
