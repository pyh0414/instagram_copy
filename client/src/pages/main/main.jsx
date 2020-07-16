import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { Col, Row } from "antd";

import PostCard from "../../components/PostCard";
import UserInfo from "../../components/UserInfo";
import Messenger from "../../components/Messenger";
import { CLIENT_ALL_POSTS } from "../../action/client";
import { CLIENT_LOGGED_IN_USER } from "../../action/client";
import { Wrapper, Side } from "./style";

const Main = () => {
	const { data: posts, loading: postsLoading } = useQuery(CLIENT_ALL_POSTS);
	const { data: loggedInUser } = useQuery(CLIENT_LOGGED_IN_USER);

	return (
		<div style={{ backgroundColor: "whilte" }}>
			<Wrapper>
				<Row>
					<Col md={16}>
						{!postsLoading &&
							posts.allPosts.map((post) => {
								return <PostCard key={post.id} post={post} />;
							})}
					</Col>

					<Col
						md={8}
						style={{
							position: "sticky",
							top: 0,
						}}
					>
						<Side>
							<UserInfo loggedInUser={loggedInUser.user} />

							<Messenger />
						</Side>
					</Col>
				</Row>
			</Wrapper>
		</div>
	);
};

export default Main;
