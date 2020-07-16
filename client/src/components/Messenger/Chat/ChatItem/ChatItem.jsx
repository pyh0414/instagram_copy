import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { Me, You } from "./style";

const ChatItem = ({ chat, loggedInUser }) => {
	const isMyChat = loggedInUser.id === chat.user.id;
	return (
		<>
			{isMyChat ? (
				<Me>
					<div> {chat.content}</div>
				</Me>
			) : (
				<You>
					<img src={`http://localhost:4000/${chat.user.profile}`} />
					<span> {chat.user.userId}</span>
					<div> {chat.content}</div>
				</You>
			)}
		</>
	);
};

export default ChatItem;
