import React, { useCallback, useState } from "react";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import { Button, Input, message } from "antd";
import produce from "immer";

import { HeaderWrapper } from "./style";
import { MUTATION_CREATE_ROOM } from "../../../action/mutation";
import {
	SUBSCRIPTION_CREATE_ROOM,
	SUBSCRIPTION_REMOVE_ROOM,
} from "../../../action/subscription";
import { VALIDATE_ALL_ROOMS } from "../../../typeValidate";

import RoomItem from "./RoomItem";

const Room = ({ allRooms, onEnterRoom }) => {
	const [roomName, setRoomName] = useState("");

	const [createRoom] = useMutation(MUTATION_CREATE_ROOM, {
		update: (cache, data) => {
			if (!data.data.createRoom) {
				return message.error("방 생성에 실패하였습니다.", 0.7);
			}
			return message.success("방을 생성하였습니다.", 0.7);
		},
	});
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

			const roomsWithCreatedRoom = produce(allRooms, (draft) => {
				draft.push(newRoom);
			});

			result.client.writeQuery({
				query: VALIDATE_ALL_ROOMS,
				data: {
					allRooms: roomsWithCreatedRoom,
				},
			});
		},
	});

	useSubscription(SUBSCRIPTION_REMOVE_ROOM, {
		onSubscriptionData: (result) => {
			const deletedRoom = result.subscriptionData.data.removeRoomEvent;
			const roomsWithDeletedRoom = allRooms.filter(
				(v) => v.id !== deletedRoom.id
			);
			result.client.writeQuery({
				query: VALIDATE_ALL_ROOMS,
				data: {
					allRooms: roomsWithDeletedRoom,
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
	}, [roomName, createRoom]);

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
				<RoomItem room={v} key={i} onEnterRoom={onEnterRoom} />
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
