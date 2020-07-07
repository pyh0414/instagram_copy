import React, { useCallback } from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import produce from "immer";
import { GET_ME } from "../Body";
import gql from "graphql-tag";
import { Button } from "antd";

import { Wrapper } from "./style";

const FOLLOW_USER = gql`
	mutation _followUser($data: followUnfollowUserInput!) {
		followUser(data: $data) {
			following {
				id
				userId
				name
				profile
			}
		}
	}
`;

const UNFOLLOW_USER = gql`
	mutation _unFollowUser($data: followUnfollowUserInput!) {
		unFollowUser(data: $data) {
			following {
				id
				userId
				name
				profile
			}
		}
	}
`;

const ShowLikerItem = ({ liker, user }) => {
	const client = useApolloClient();

	const data = {
		me: parseInt(user.id),
		you: parseInt(liker.id),
	};

	const [followUser] = useMutation(FOLLOW_USER, {
		update: async (cache, data) => {
			const result = data.data.followUser;
			const newUser = produce(user, (draft) => {
				draft.following = result.following;
			});

			client.writeQuery({
				query: GET_ME,
				data: { user: newUser },
			});
		},
	});

	const [unFollowUser] = useMutation(UNFOLLOW_USER, {
		update: async (cache, data) => {
			const result = data.data.unFollowUser;

			const newUser = produce(user, (draft) => {
				draft.following = result.following;
			});

			client.writeQuery({
				query: GET_ME,
				data: { user: newUser },
			});
		},
	});

	const follow = useCallback(() => {
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

	const unFollow = useCallback(() => {
		console.log(user.id, liker.id);
		unFollowUser({
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
					<img
						src={`http://localhost:4000/${liker.profile}`}
						alt="follow img"
					/>
					<span>{liker.userId}</span>
					<Button type="danger" onClick={unFollow}>
						팔로우 취소
					</Button>
				</div>
			) : (
				<div>
					<img
						src={`http://localhost:4000/${liker.profile}`}
						alt="follow img"
					/>
					<span>{liker.userId}</span>
					<Button type="primary" onClick={follow}>
						팔로우
					</Button>
				</div>
			)}
		</Wrapper>
	);
};

export default ShowLikerItem;
