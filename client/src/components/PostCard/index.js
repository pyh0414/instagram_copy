import React from "react";

import Head from "./Head";
import Image from "./Image";
import Body from "./Body";
import CommentInput from "./CommentInput";

import { Wrapper, Container } from "./style";

// const PostCard = ({ post }) => {
const PostCard = () => {
	return (
		<Container>
			<Wrapper>
				{/* <Head user={post.User} />
				<Image images={post.Images} />
				<Body post={post} />
				<CommentInput postId={post.id} /> */}
				<Head />
				<Image />
				<Body />
				<CommentInput />
			</Wrapper>
		</Container>
	);
};

export default PostCard;
