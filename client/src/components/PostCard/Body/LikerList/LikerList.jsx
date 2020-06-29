import React, { useCallback } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button } from "antd";

import { Wrapper } from "./style";

const FOLLOW_USER = gql`
	mutation _followUser($data: followUnfollowUserInput!) {
		followUser(data: $data) {
			id
			name
			userId
			profile
		}
	}
`;

const ShowLikerItem = ({ liker, user }) => {
	const [followUser] = useMutation(FOLLOW_USER, {
		update: async (cache, data) => {
			// 	const newComment = data.data.createComment;
			// 	const currentAllPost = await cache.readQuery({
			// 		query: ALL_POSTS_INFO,
			// 	}).allPosts;
			// 	const currentPostIndex = currentAllPost.findIndex(
			// 		(post) => parseInt(post.id) === newComment.postId
			// 	);
			// 	const allPosts = produce(currentAllPost, (draft) => {
			// 		draft[currentPostIndex].comments.push(newComment);
			// 	});
			// 	client.writeQuery({
			// 		query: ALL_POSTS_INFO,
			// 		data: { allPosts },
			// 	});
		},
	});

	const onFollow = useCallback(() => {
		const data = {
			me: parseInt(user.id),
			you: parseInt(liker.id),
		};

		followUser({
			variables: {
				data,
			},
			context: {
				headers: {
					authorization: "Bearer pass",
				},
			},
		});
	}, []);

	const unFollow = useCallback(() => {}, []);

	const isFollowing = user.following.some((v) => {
		// 현재 liker를 내가 팔로잉 하고 있는지

		return v.id === liker.id;
	});

	const selfLiked = user.id === liker.id;
	return (
		<Wrapper>
			{selfLiked ? (
				<div></div>
			) : isFollowing ? (
				<div>
					<img src={`http://localhost${liker.profile}`} alt="follow img" />
					<span>{liker.userId}</span>
					<Button type="danger" onClick={unFollow}>
						팔로우 취소
					</Button>
				</div>
			) : (
				<div>
					<img src={`http://localhost${liker.profile}`} alt="follow img" />
					<span>{liker.userId}</span>
					<Button type="danger" onClick={onFollow}>
						팔로우
					</Button>
				</div>
			)}
		</Wrapper>
	);
};

export default ShowLikerItem;
