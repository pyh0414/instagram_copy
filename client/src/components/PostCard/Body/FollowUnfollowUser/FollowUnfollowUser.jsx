import React, { useCallback } from "react";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import produce from "immer";
import { Button } from "antd";

import {
	MUTATION_UNFOLLOW_USER,
	MUTATION_FOLLOW_USER,
} from "../../../../action/mutation";
import { VALIDATE_LOGGED_IN_USER } from "../../../../typeValidate";
import { Wrapper } from "./style";

const FollowUnfollowUser = ({ user, loggedInUser }) => {
	const client = useApolloClient();

	const data = {
		me: parseInt(loggedInUser.id),
		you: parseInt(user.id),
	};

	const [followUser] = useMutation(MUTATION_FOLLOW_USER, {
		update: async (cache, data) => {
			const result = data.data.followUser;
			const newUser = produce(loggedInUser, (draft) => {
				draft.following = result.me.following;
			});

			client.writeQuery({
				query: VALIDATE_LOGGED_IN_USER,
				data: { user: newUser },
			});
		},
	});

	const [unFollowUser] = useMutation(MUTATION_UNFOLLOW_USER, {
		update: async (cache, data) => {
			const result = data.data.unFollowUser;

			const newUser = produce(loggedInUser, (draft) => {
				draft.following = result.me.following;
			});

			client.writeQuery({
				query: VALIDATE_LOGGED_IN_USER,
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
	}, [data, followUser]);

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
	}, [data, unFollowUser]);

	const isFollowing = loggedInUser.following.some((v) => {
		// 현재 user를 내가 팔로잉 하고 있는지

		return v.id === user.id;
	});

	const selfLiked = loggedInUser.id === user.id;
	// 현재 user가 나인지, 내가 나를 follow할 필요는 없음

	if (selfLiked) {
		return (
			<Wrapper>
				<img
					src={`http://${process.env.REACT_APP_DEV_SERVER}/${user.profile}`}
					alt="follow img"
				/>
				<span>{user.userId}</span>
			</Wrapper>
		);
	}
	return (
		<Wrapper>
			{isFollowing ? (
				<div>
					<img
						src={`http://${process.env.REACT_APP_DEV_SERVER}/${user.profile}`}
						alt="follow img"
					/>
					<span>{user.userId}</span>
					<Button
						type="danger"
						onClick={unFollow}
						icon={<UserDeleteOutlined />}
					>
						언팔로우
					</Button>
				</div>
			) : (
				<div>
					<img
						src={`http://${process.env.REACT_APP_DEV_SERVER}/${user.profile}`}
						alt="follow img"
					/>
					<span>{user.userId}</span>
					<Button type="primary" onClick={follow} icon={<UserAddOutlined />}>
						팔로우
					</Button>
				</div>
			)}
		</Wrapper>
	);
};

export default FollowUnfollowUser;
