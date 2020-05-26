import React from "react";

import { Me, You } from "./style";

// const ChatItem = ({ item }) => {
const ChatItem = () => {
	const item = {
		content: "댓글입니다!!",
		User: {
			id: "whwlsvy12",
			profile: "http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png",
		},
	};

	const user = {
		id: "EY152",
	};
	return (
		<>
			{user && user.id === item.User.id ? (
				<Me>
					<div> {item.content}</div>
				</Me>
			) : (
				<You>
					<img src={item.User.profile} />
					<span> {item.User.id}</span>
					<div> {item.content}</div>
				</You>
			)}
		</>
	);
};

export default ChatItem;
