import React, { useEffect } from "react";

import Room from "./Room";
import Chat from "./Chat";

import { Wrapper } from "./style";

const Messenger = () => {
	useEffect(() => {
		// roomSocket &&
		// 	roomSocket.on("remove_room_success", (roomId) => {
		// 		dispatch({
		// 			type: REMOVE_ROOM_SUCCESS,
		// 			data: roomId,
		// 		});
		// 	});
		// roomSocket &&
		// 	roomSocket.on("make_room_success", (room) => {
		// 		const { id, name, master } = room;
		// 		dispatch({
		// 			type: MAKE_ROOM_SUCCESS,
		// 			data: { id, name, master },
		// 		});
		// 	});
		// roomSocket &&
		// 	roomSocket.on("send_message_success", (data) => {
		// 		dispatch({
		// 			type: SEND_MESSAGE_SUCCESS,
		// 			data,
		// 		});
		// 	});
		// roomSocket &&
		// 	roomSocket.on("enter_room_success", (room) => {
		// 		dispatch({
		// 			type: ENTER_ROOM_SUCCESS,
		// 			data: room,
		// 		});
		// 	});
		// roomSocket &&
		// 	roomSocket.on("out_room_success", () => {
		// 		dispatch({
		// 			type: OUT_ROOM_SUCCESS,
		// 		});
		// 	});
	}, []);

	// const { currentRoom } = useSelector((state) => state.chat);
	const currentRoom = true;
	return <Wrapper>{currentRoom ? <Chat /> : <Room />}</Wrapper>;
};

export default Messenger;
