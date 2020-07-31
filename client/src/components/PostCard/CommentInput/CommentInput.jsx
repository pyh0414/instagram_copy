import React, { useState, useCallback } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import produce from "immer";

import { MUTATION_CREATE_COMMNET } from "../../../action/mutation";
import { Wrapper, CommentInput } from "./style";
import { VALIDATE_ALL_POSTS } from "../../../typeValidate";

const Comment = ({ postId }) => {
	const [content, setContent] = useState("");

	const client = useApolloClient();
	const [createComment] = useMutation(MUTATION_CREATE_COMMNET, {
		update: async (cache, data) => {
			const newComment = data.data.createComment;

			const currentAllPost = await cache.readQuery({
				query: VALIDATE_ALL_POSTS,
			}).allPosts;

			const currentPostIndex = currentAllPost.findIndex(
				(post) => parseInt(post.id) === newComment.postId
			);

			const allPosts = produce(currentAllPost, (draft) => {
				draft[currentPostIndex].comments.push(newComment);
			});

			client.writeQuery({
				query: VALIDATE_ALL_POSTS,
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
				});
				setContent("");
			}
		},
		[content, createComment, postId]
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
