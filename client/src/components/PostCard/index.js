import React from "react";
import styled from "styled-components";

import Head from "./Head";
import Images from "./Images";
import Body from "./Body";
import CommentInput from "./CommentInput";

const Wrapper = styled.div`
	margin-left: 40%;
	width: 60%;
	height: 100%;
	background-color: #fff;
	border: 1px solid #edebeb;
`;

const Container = styled.div`
	padding-top: 40px;
`;

const PostCard = ({ post }) => {
	return (
		<Container>
			<Wrapper>
				<Head user={post.User} />
				<Images images={post.Images} />
				<Body post={post} />
				<CommentInput postId={post.id} />
			</Wrapper>
		</Container>
	);
};

export default PostCard;
