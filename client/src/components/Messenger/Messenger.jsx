import React, { useState, useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";

import { CLIENT_ALL_ROOMS } from "../../action/client";

import Room from "./Room";
import Chat from "./Chat";

import { Wrapper } from "./style";

const Messenger = () => {
	const [currentRoomId, setCurrentRoomId] = useState(-1);

	const { data } = useQuery(CLIENT_ALL_ROOMS);

	const onEnterRoom = useCallback((roomId) => {
		setCurrentRoomId(roomId);
	}, []);

	const onLeaveRoom = useCallback(() => {
		setCurrentRoomId(-1);
	}, []);

	return (
		<Wrapper>
			{currentRoomId > 0 ? (
				<Chat
					currentRoomId={currentRoomId}
					allRooms={data.allRooms}
					onLeaveRoom={onLeaveRoom}
				/>
			) : (
				<Room allRooms={data.allRooms} onEnterRoom={onEnterRoom} />
			)}
		</Wrapper>
	);
};

export default Messenger;
