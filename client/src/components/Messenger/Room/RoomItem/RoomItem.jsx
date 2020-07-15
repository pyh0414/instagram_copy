import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Button, message } from "antd";

import { Wrapper } from "./style";
import { CLIENT_LOGGED_IN_USER } from "../../../../action/client";
import { MUTATION_REMOVE_ROOM } from "../../../../action/mutation";

const RoomItem = ({ room }) => {
	const { data: loggedInUser, loading: loggedInUserLoading } = useQuery(
		CLIENT_LOGGED_IN_USER
	);

	const [removeRoom] = useMutation(MUTATION_REMOVE_ROOM, {
		update: (cache, data) => {
			if (!data.data.removeRoom) {
				return message.error("방 삭제에 실패하였습니다.", 0.7);
			}
			return message.success("방을 삭제하였습니다.", 0.7);
		},
	});

	const onRemoveRoom = (roomId) => () => {
		removeRoom({
			variables: { roomId },
			context: {
				headers: {
					authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			},
		});
	};
	const onEnterRoom = (roomId) => () => {};

	if (loggedInUserLoading) {
		return <div>loding...</div>;
	}

	const isRoomCreatedByLoggeinUser =
		room.owner.userId === loggedInUser.user.userId;

	return (
		<Wrapper>
			<span>{room.name}</span>

			<Button
				style={{ float: "right" }}
				type="primary"
				size="small"
				onClick={onEnterRoom(room.id)}
			>
				입장
			</Button>
			{isRoomCreatedByLoggeinUser && (
				<Button
					style={{ float: "right", marginRight: "6px" }}
					type="danger"
					size="small"
					onClick={onRemoveRoom(room.id)}
				>
					방삭제
				</Button>
			)}
		</Wrapper>
	);
};
export default RoomItem;
