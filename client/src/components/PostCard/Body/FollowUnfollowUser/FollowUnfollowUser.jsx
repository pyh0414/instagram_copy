import React, { useCallback, useEffect } from "react";
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

const FollowUnfollowUser = ({ user, loggedInUser }) => {
	const client = useApolloClient();

	const data = {
		me: parseInt(loggedInUser.id),
		you: parseInt(user.id),
	};

	const [followUser] = useMutation(FOLLOW_USER, {
		update: async (cache, data) => {
			const result = data.data.followUser;
			const newUser = produce(loggedInUser, (draft) => {
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
			const result = await data.data.unFollowUser;

			const newUser = await produce(loggedInUser, (draft) => {
				draft.following = result.following;
			});

			await client.writeQuery({
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
	});

	// useCallback 2번쨰 인자로 []를 넣으면 user 페이지에서 unfollow에 문제가 생김
	const unFollow = useCallback(() => {
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
	});

	const isFollowing = loggedInUser.following.some((v) => {
		// 현재 user를 내가 팔로잉 하고 있는지

		return v.id === user.id;
	});

	const selfLiked = loggedInUser.id === user.id;
	return (
		<Wrapper>
			{selfLiked ? (
				<div></div>
			) : isFollowing ? (
				<div>
					<img src={`http://localhost:4000/${user.profile}`} alt="follow img" />
					<span>{user.userId}</span>
					<Button type="danger" onClick={unFollow}>
						팔로우 취소
					</Button>
				</div>
			) : (
				<div>
					<img src={`http://localhost:4000/${user.profile}`} alt="follow img" />
					<span>{user.userId}</span>
					<Button type="primary" onClick={follow}>
						팔로우
					</Button>
				</div>
			)}
		</Wrapper>
	);
};

export default FollowUnfollowUser;
