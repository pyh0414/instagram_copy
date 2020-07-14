import React, { useCallback } from "react";

import { Button } from "antd";

import { Wrapper } from "./style";

const RoomItem = ({ room }) => {
	const onRemoveRoom = useCallback((roomId) => () => {}, []);

	const onEnterRoom = useCallback((roomId) => () => {}, []);

	return (
		<Wrapper>
			<span>{room.name}</span>

			{/* {user && user.id === room.master ? ( */}
			{true ? (
				<>
					<Button
						style={{ float: "right" }}
						type="primary"
						size="small"
						onClick={onEnterRoom(room.id)}
					>
						입장
					</Button>
					<Button
						style={{ float: "right", marginRight: "6px" }}
						type="danger"
						size="small"
						onClick={onRemoveRoom(room.id)}
					>
						방삭제
					</Button>
				</>
			) : (
				<Button
					style={{ float: "right" }}
					type="primary"
					size="small"
					onClick={onEnterRoom(room.id)}
				>
					입장
				</Button>
			)}
		</Wrapper>
	);
};
export default RoomItem;
