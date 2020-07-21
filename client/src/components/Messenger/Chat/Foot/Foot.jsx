import React, { useState, useCallback } from "react";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import { Input, Button } from "antd";
import produce from "immer";

import { MUTATION_CREATE_CHAT } from "../../../../action/mutation";
import { SUBSCRIPTION_CREATE_CHAT } from "../../../../action/subscription";
import { VALIDATE_ALL_ROOMS } from "../../../../typeValidate";

import { Wrapper } from "./style";

const Foot = ({ onLeaveRoom, currentRoomId, allRooms }) => {
	const [content, setContent] = useState("");

	const [createChat] = useMutation(MUTATION_CREATE_CHAT);
	const onChangeContent = useCallback((e) => {
		setContent(e.target.value);
	}, []);

	useSubscription(SUBSCRIPTION_CREATE_CHAT, {
		onSubscriptionData: (data) => {
			const newChat = data.subscriptionData.data.createChatEvent;

			const roomIndex = allRooms.findIndex(
				(room) => room.id === newChat.room.id
			);

			const allRoomsWithNewChat = produce(allRooms, (draft) => {
				draft[roomIndex].chats.push(newChat);
			});

			data.client.writeQuery({
				query: VALIDATE_ALL_ROOMS,
				data: {
					allRooms: allRoomsWithNewChat,
				},
			});
		},
	});

	const onEnterPress = useCallback(
		(e) => {
			if (e.key === "Enter" && content.trim()) {
				const data = { content, roomId: parseInt(currentRoomId) };
				createChat({
					variables: { data },
					context: {
						headers: {
							authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					},
				});
				setContent("");
			}
		},
		[content, createChat, currentRoomId]
	);

	const leaveRoom = useCallback(() => {
		onLeaveRoom();
	}, [onLeaveRoom]);
	return (
		<Wrapper>
			<Input
				value={content}
				onChange={onChangeContent}
				onKeyPress={onEnterPress}
			/>
			<Button style={{ height: "100%" }} onClick={leaveRoom}>
				나가기
			</Button>
		</Wrapper>
	);
};

export default Foot;
