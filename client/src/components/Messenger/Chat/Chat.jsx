import React from "react";

import ChatItem from "./ChatItem";
import Foot from "./Foot";

const Index = () => {
	const currentRoom = {
		chats: [1, 2, 3, 4],
	};
	return (
		<>
			<div style={{ height: "93%", overflow: "scroll" }}>
				{currentRoom.chats.length > 0 &&
					currentRoom.chats.map((v, i) => {
						// return <ChatItem item={v} key={v.id} />;
						return <ChatItem key={Math.random()} />;
					})}
			</div>
			<Foot />
		</>
	);
};

export default Index;
