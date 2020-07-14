import React, { useCallback, useState } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import { Button, Input, message } from "antd";
import produce from "immer";

import { HeaderWrapper } from "./style";
import { MUTATION_CREATE_ROOM } from "../../../action/mutation";
import { SUBSCRIPTION_CREATE_ROOM } from "../../../action/subscription";
import { VALIDATE_ALL_ROOMS } from "../../../typeValidate";
import { CLIENT_ALL_ROOMS } from "../../../action/client";

import RoomShow from "./RoomShow";
import RoomItem from "./RoomItem";

const Room = () => {
	const [roomName, setRoomName] = useState("");

	const [createRoom] = useMutation(MUTATION_CREATE_ROOM);
	const { data } = useQuery(CLIENT_ALL_ROOMS);
	const allRooms = data.allRooms;
	// const { subscribeToMore, ...data } = useQuery(QUERY_ALL_ROOMS, {
	// 	context: {
	// 		headers: {
	// 			authorization: "Bearer pass",
	// 		},
	// 	},
	// });

	useSubscription(SUBSCRIPTION_CREATE_ROOM, {
		onSubscriptionData: (result) => {
			const newRoom = result.subscriptionData.data.createRoomEvent;
			const currentRooms = result.client.readQuery({ query: CLIENT_ALL_ROOMS })
				.allRooms;

			const allRooms = produce(currentRooms, (draft) => {
				draft.push(newRoom);
			});

			result.client.writeQuery({
				query: VALIDATE_ALL_ROOMS,
				data: {
					allRooms,
				},
			});
		},
	});
	const onChnageRoomName = useCallback((e) => {
		setRoomName(e.target.value);
	}, []);

	const onMakeRoom = useCallback(() => {
		if (roomName.trim() === "") {
			return message.error("채팅방 이름을 입력해 주세요 !");
		}

		const room = { name: roomName };
		createRoom({
			variables: { room },
			context: {
				headers: {
					authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			},
		});

		setRoomName("");
	}, [roomName]);

	return (
		<>
			<HeaderWrapper>
				<Input
					value={roomName}
					onChange={onChnageRoomName}
					placeholder="방 이름을 적어주세요"
				/>
				<Button style={{ width: "40%", heigth: "100%" }} onClick={onMakeRoom}>
					방생성
				</Button>
			</HeaderWrapper>
			{allRooms.map((v, i) => (
				<RoomItem room={v} key={i} />
			))}
			{/* <RoomShow
				result={data}
				subscribeToNewComments={() =>
					subscribeToMore({
						document: SUBSCRIPTION_CREATE_ROOM,
						updateQuery: (prev, data) => {
							const currentRooms = prev.getAllRooms;
							const newRoom = data.subscriptionData.data.createRoomEvent;

							console.log(currentRooms);
							console.log(newRoom);
							if (!newRoom) {
								return currentRooms;
							}
							const newData = [newRoom, ...currentRooms];

							return {
								getAllRooms: newData,
							};
						},
					})
				}
			/> */}
		</>
	);
};

export default Room;
