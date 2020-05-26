import React, { useEffect } from "react";
import { Col, Row } from "antd";

import PostCard from "../../components/PostCard";
import UserInfo from "../../components/UserInfo";
import Messenger from "../../components/Messenger";

// import { LOAD_MAIN_POSTS_REQUEST } from "../reducer/post";
// import { LOAD_CHAT_ROOM_REQUEST } from "../reducer/chat";

import { Wrapper, Side } from "./style";

const Main = () => {
	// const { user } = useSelector((state) => state.user);
	// const { mainPosts } = useSelector((state) => state.post);

	// const dispatch = useDispatch();

	useEffect(() => {
		// dispatch({
		// 	type: LOAD_MAIN_POSTS_REQUEST
		// });
		// dispatch({
		// 	type: LOAD_CHAT_ROOM_REQUEST
		// });
	}, []);

	return (
		<div style={{ backgroundColor: "whilte" }}>
			<Wrapper>
				<Row>
					<Col md={16}>
						{/* {mainPosts &&
							mainPosts.map((v) => {
								return <PostCard key={v.id} post={v} />;
							})} */}
					</Col>

					<Col
						md={8}
						style={{
							position: "sticky",
							top: 0,
						}}
					>
						<Side>
							{/* <UserInfo user={user} /> */}
							<UserInfo />
							<Messenger />
						</Side>
					</Col>
				</Row>
			</Wrapper>
		</div>
	);
};

export default Main;
