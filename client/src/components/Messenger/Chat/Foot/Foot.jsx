import React, { useState, useCallback } from "react";
import { Input, Button } from "antd";
import Icon from "@ant-design/icons";

import { Wrapper } from "./style";

const Foot = () => {
	const [content, setContent] = useState("");

	const onChangeContent = useCallback((e) => {
		setContent(e.target.value);
	}, []);

	const onEnterPress = useCallback(
		(e) => {
			if (e.key === "Enter" && content.trim()) {
				// axios.post(
				// 	`/room/${currentRoom.roomId}/chat`,
				// 	{ content },
				// 	{ withCredentials: true }
				// );
				setContent("");
			}
		},
		[content]
	);
	const onOutRoom = useCallback(() => {
		// axios
		// 	.post(`/room/${currentRoom.roomId}/out`, {}, { withCredentials: true })
		// 	.then((room) => {
		// 		roomSocket.emit("out_room_request", room.data);
		// 	});
	}, []);
	return (
		<Wrapper>
			<Input
				value={content}
				onChange={onChangeContent}
				suffix={<Icon type="edit" />}
				onKeyPress={onEnterPress}
			/>
			<Button style={{ height: "100%" }} onClick={onOutRoom}>
				나가기
			</Button>
		</Wrapper>
	);
};

export default Foot;
