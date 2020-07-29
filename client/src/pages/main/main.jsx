import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Col, Row } from "antd";

import PostCard from "../../components/PostCard";
import UserInfo from "../../components/UserInfo";
import Messenger from "../../components/Messenger";
import Header from "../../components/Header";

import { CLIENT_ALL_POSTS } from "../../action/client";
import { CLIENT_LOGGED_IN_USER } from "../../action/client";

import { Wrapper } from "./style";

const Main = () => {
	const { data: posts } = useQuery(CLIENT_ALL_POSTS);
	const { data: loggedInUser } = useQuery(CLIENT_LOGGED_IN_USER);

	return (
		<div>
			<Header />

			<Wrapper>
				<Row justify="center" gutter={[48]}>
					<Col lg={12} md={18} sm={20} xs={22}>
						{posts.allPosts.map((post) => {
							return <PostCard key={post.id} post={post} />;
						})}
					</Col>

					<Col
						lg={4}
						md={0}
						sm={0}
						xs={0}
						style={{
							height: "60%",
							width: "300px",
							position: "sticky",
							top: "10vh",
						}}
					>
						<UserInfo user={loggedInUser.user} />
						<Messenger />
					</Col>
				</Row>
			</Wrapper>
		</div>
	);
};

export default Main;
