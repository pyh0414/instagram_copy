import React from "react";

import Head from "./Head";
import Image from "./Image";
import Body from "./Body";
import CommentInput from "./CommentInput";

import { Wrapper, Container } from "./style";

const PostCard = ({ post }) => {
	return (
		<Container>
			<Wrapper>
				<Head author={post.author} />
				<Image images={post.images} />
				<Body post={post} />
				<CommentInput postId={post.id} />
			</Wrapper>
		</Container>
	);
};

export default PostCard;
