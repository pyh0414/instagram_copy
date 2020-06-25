import React from "react";

import LikeIcon from "./LikeIcon/LikeIcon";
import Liker from "./PostLiker/PostLiker";
import Content from "./PostContent/PostContent";
import Comment from "./PostComment/PostComment";

import { Wrapper } from "./style";

const Body = ({ post }) => {
	return (
		<Wrapper>
			{/* <LikeIcon postId={post.id} likers={post.Likers} /> */}
			{/* <Liker likers={post.Likers} /> */}
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
