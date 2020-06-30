import React from "react";

import RoomItem from "./RoomItem";
import Head from "./Head";

import { Wrapper } from "./style";

const Room = () => {
	const rooms = [1, 2, 3];
	return (
		<>
			<Head />
			<Wrapper>
				{rooms &&
					rooms.map((v, i) => {
						// return <RoomItem room={v} key={v.id} />;
						return <RoomItem room={v} key={v.id} />;
					})}
			</Wrapper>
		</>
	);
};

export default Room;
