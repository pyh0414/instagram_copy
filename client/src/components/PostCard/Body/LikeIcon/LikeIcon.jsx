import React, { useCallback } from "react";
import { HeartTwoTone, HeartOutlined } from "@ant-design/icons";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import { ALL_POSTS_INFO } from "../../../../type";
import gql from "graphql-tag";
import produce from "immer";

import { Wrapper } from "./style";

const LIKE_TO_POST = gql`
	mutation _likeToPost($data: likeOrUnlikeToPostInput!) {
		likeToPost(data: $data)
	}
`;

const UNLIKE_TO_POST = gql`
	mutation _unLikeToPost($data: likeOrUnlikeToPostInput!) {
		unLikeToPost(data: $data)
	}
`;

const LikeIcon = ({ postId, user, likers }) => {
	const likeChecked = likers.find((v) => v.user.id === user.id);
	const client = useApolloClient();

	const [likeToPost] = useMutation(LIKE_TO_POST, {
		context: {
			headers: {
				authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		},
		update: async (cache, data) => {
			const result = data.data.likeToPost;
			if (result) {
				const currentAllPost = await cache.readQuery({
					query: ALL_POSTS_INFO,
				}).allPosts;

				const currentPostIndex = currentAllPost.findIndex(
					(post) => post.id === postId
				);

				const allPosts = produce(currentAllPost, (draft) => {
					draft[currentPostIndex].likers.push({ user, __typename: "Liker" });
				});

				client.writeQuery({
					query: ALL_POSTS_INFO,
					data: { allPosts },
				});
			}
		},
	});

	const [unLikeToPost] = useMutation(UNLIKE_TO_POST, {
		context: {
			headers: {
				authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		},
		update: async (cache, data) => {
			const result = data.data.unLikeToPost;

			if (result) {
				const currentAllPost = await cache.readQuery({
					query: ALL_POSTS_INFO,
				}).allPosts;

				const currentPostIndex = currentAllPost.findIndex(
					(post) => post.id === postId
				);

				const newLikers = likers.filter((v) => v.user.id !== user.id);
				const allPosts = produce(currentAllPost, (draft) => {
					draft[currentPostIndex].likers = newLikers;
				});

				client.writeQuery({
					query: ALL_POSTS_INFO,
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
	});

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
