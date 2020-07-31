import React, { useCallback } from "react";
import { HeartTwoTone, HeartOutlined } from "@ant-design/icons";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import produce from "immer";

import {
	MUTATION_UNLIKE_TO_POST,
	MUTATION_LIKE_TO_POST,
} from "../../../../action/mutation";
import { VALIDATE_ALL_POSTS } from "../../../../typeValidate";

import { Wrapper } from "./style";

const LikeIcon = ({ postId, user, likers }) => {
	const likeChecked = likers.find((v) => v.user.id === user.id);
	const client = useApolloClient();

	const [likeToPost] = useMutation(MUTATION_LIKE_TO_POST, {
		update: async (cache, data) => {
			const likedPost = data.data.likeToPost;

			if (likedPost) {
				const currentAllPost = await cache.readQuery({
					query: VALIDATE_ALL_POSTS,
				}).allPosts;

				const currentPostIndex = currentAllPost.findIndex(
					(post) => post.id === postId
				);

				const allPosts = produce(currentAllPost, (draft) => {
					draft[currentPostIndex].likers.push({ user, __typename: "Liker" });
				});

				client.writeQuery({
					query: VALIDATE_ALL_POSTS,
					data: { allPosts },
				});
			}
		},
	});

	const [unLikeToPost] = useMutation(MUTATION_UNLIKE_TO_POST, {
		update: async (cache, data) => {
			const unLikedPost = data.data.unLikeToPost;

			if (unLikedPost) {
				const currentAllPost = await cache.readQuery({
					query: VALIDATE_ALL_POSTS,
				}).allPosts;

				const currentPostIndex = currentAllPost.findIndex(
					(post) => post.id === postId
				);

				const newLikers = likers.filter((v) => v.user.id !== user.id);
				const allPosts = produce(currentAllPost, (draft) => {
					draft[currentPostIndex].likers = newLikers;
				});

				client.writeQuery({
					query: VALIDATE_ALL_POSTS,
					data: { allPosts },
				});
			}
		},
	});

	const onToggleLike = useCallback(() => {
		const data = {
			userId: parseInt(user.id),
			postId: parseInt(postId),
		};

		if (likeChecked) {
			unLikeToPost({
				variables: {
					data,
				},
			});
		} else {
			likeToPost({
				variables: {
					data,
				},
			});
		}
	}, [user, postId, unLikeToPost, likeToPost, likeChecked]);

	return (
		<Wrapper>
			{likeChecked ? (
				<HeartTwoTone
					type="heart"
					twoToneColor="red"
					style={{ fontSize: "27px" }}
					onClick={onToggleLike}
				/>
			) : (
				<HeartOutlined
					type="heart"
					style={{ fontSize: "27px" }}
					onClick={onToggleLike}
				/>
			)}
		</Wrapper>
	);
};

export default LikeIcon;
