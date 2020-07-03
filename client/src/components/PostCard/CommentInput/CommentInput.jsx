import React, { useState, useCallback } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import produce from "immer";
import gql from "graphql-tag";

import { Wrapper, CommentInput } from "./style";
import { ALL_POSTS_INFO } from "../../../type";

const CREATE_COMMNET = gql`
	mutation _createComment($comment: createCommentInput!) {
		createComment(comment: $comment) {
			id
			content
			postId
			author {
				id
				userId
				profile
				name
			}
		}
	}
`;
const Comment = ({ postId }) => {
	const [content, setContent] = useState("");

	const client = useApolloClient();

	const [createComment] = useMutation(CREATE_COMMNET, {
		update: async (cache, data) => {
			const newComment = data.data.createComment;
			const currentAllPost = await cache.readQuery({
				query: ALL_POSTS_INFO,
			}).allPosts;

			const currentPostIndex = currentAllPost.findIndex(
				(post) => parseInt(post.id) === newComment.postId
			);

			const allPosts = produce(currentAllPost, (draft) => {
				draft[currentPostIndex].comments.push(newComment);
			});

			client.writeQuery({
				query: ALL_POSTS_INFO,
				data: { allPosts },
			});
		},
	});
	const onChangeText = useCallback((e) => {
		setContent(e.target.value);
	}, []);

	const onEnterPress = useCallback(
		(e) => {
			if (e.key === "Enter" && content.trim()) {
				const comment = { postId: parseInt(postId), content };
				createComment({
					variables: {
						comment,
					},
					context: {
						headers: {
							authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					},
				});
				setContent("");
			}
		},
		[content]
	);

	return (
		<Wrapper>
			<CommentInput
				type="text"
				placeholder="댓글달기..."
				value={content}
				onChange={onChangeText}
				onKeyPress={onEnterPress}
			/>
		</Wrapper>
	);
};

export default Comment;
