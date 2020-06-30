import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import LikeIcon from "./LikeIcon/LikeIcon";
import Liker from "./PostLiker/PostLiker";
import Content from "./PostContent/PostContent";
import Comment from "./PostComment/PostComment";

import { Wrapper } from "./style";

export const GET_ME = gql`
	query {
		user @client {
			id
			userId
			name
			profile
			following {
				id
				userId
				name
				profile
			}
		}
	}
`;

const Body = ({ post }) => {
	const { data } = useQuery(GET_ME);

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
