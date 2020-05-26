import React from "react";

import LikeIcon from "./LikeIcon/LikeIcon";
import Liker from "./PostLiker/PostLiker";
import Content from "./PostContent/PostContent";
import Comment from "./PostComment/PostComment";

import { Wrapper } from "./style";

// const Body = ({ post }) => {
const Body = () => {
	const post = {
		id: "id",
		content: "postContent",
		Likers: [{ id: "zxc" }, { id: "qwe" }],
		Comments: [
			{ userId: "user1", profile: "profile1" },
			{ userId: "user2", profile: "profile2" },
		],
	};
	return (
		<Wrapper>
			<LikeIcon postId={post.id} likers={post.Likers} />
			<Liker likers={post.Likers} />
			<Content contents={post.content} />
			{post.Comments && post.Comments.length > 4 ? (
				<div
					style={{ marginTop: "13px", overflow: "scroll", maxHeight: "150px" }}
				>
					<Comment comments={post.Comments} />
				</div>
			) : (
				<div style={{ marginTop: "13px" }}>
					<Comment comments={post.Comments} />
				</div>
			)}
		</Wrapper>
	);
};

export default Body;
