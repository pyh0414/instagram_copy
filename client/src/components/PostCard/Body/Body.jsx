import React from "react";
import { useQuery } from "@apollo/react-hooks";

import LikeIcon from "./LikeIcon/LikeIcon";
import Liker from "./PostLiker/PostLiker";
import Content from "./PostContent/PostContent";
import Comment from "./PostComment/PostComment";
import { Wrapper } from "./style";
import { CLIENT_LOGGED_IN_USER } from "../../../action/client";

const Body = ({ post }) => {
	const { data } = useQuery(CLIENT_LOGGED_IN_USER);

	return (
		<Wrapper>
			<LikeIcon postId={post.id} likers={post.likers} user={data.user} />
			<Liker likers={post.likers} user={data.user} />
			<Content contents={post.content} />
			{post.comments && post.comments.length > 4 ? (
				<div
					style={{ marginTop: "13px", overflow: "scroll", maxHeight: "150px" }}
				>
					<Comment comments={post.comments} />
				</div>
			) : (
				<div style={{ marginTop: "13px" }}>
					<Comment comments={post.comments} />
				</div>
			)}
		</Wrapper>
	);
};

export default Body;
