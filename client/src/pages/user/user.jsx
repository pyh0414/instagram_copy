import React, { useState, useCallback, useRef } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/react-hooks";
import { EditOutlined } from "@ant-design/icons";
import { Row, Col, Button } from "antd";
import produce from "immer";
import gql from "graphql-tag";

import {
	Wrapper,
	UserInfo,
	UserImage,
	CustomUl,
	ImgCustom,
	RefWrapper,
	ShowFollow,
} from "./style";
import { GET_ME } from "../../components/PostCard/Body/Body";
import { OTHER_USER_INFO } from "../../components/Header/Item";
import PostModal from "../../components/PostModal";
import UserUpdateModal from "../../components/UserUpdateModal";
import Item from "../../components/PostCard/Body/FollowUnfollowUser";

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

const UNFOLLOW_USER = gql`
	mutation _unFollowUser($data: followUnfollowUserInput!) {
		unFollowUser(data: $data) {
			id
			name
			userId
			profile
		}
	}
`;

const User = () => {
	const [postModal, setPostModal] = useState(false);
	const [userUpdateModal, setUserUpdateModal] = useState(false);
	const [post, setPost] = useState(null);
	const showFollowingRef = useRef();
	const showFollowerRef = useRef();

	const { data: myData } = useQuery(GET_ME);
	const { data: otherData } = useQuery(OTHER_USER_INFO);

	const me = myData.user;
	const you = otherData.otherUser;
	let currentUser;
	let isMeFollowYou;

	if (you) {
		isMeFollowYou = me.following.some((v) => {
			return v.id === you.id;
		});
		currentUser = you;
	} else {
		currentUser = me;
	}

	const client = useApolloClient();

	const onFollowingMouseOver = useCallback(() => {
		showFollowingRef.current.style.display = "block";
	}, []);

	const onFollowingMouseOut = useCallback(() => {
		showFollowingRef.current.style.display = "none";
	}, []);

	const onFollowerMouseOver = useCallback(() => {
		showFollowerRef.current.style.display = "block";
	}, []);

	const onFollowerMouseOut = useCallback(() => {
		showFollowerRef.current.style.display = "none";
	}, []);

	const onCloseModal = useCallback(() => {
		setPostModal(false);
	}, []);

	const onOpenModal = useCallback(
		(post) => () => {
			setPost(post);
			setPostModal(true);
		},
		[]
	);

	const [followUser] = useMutation(FOLLOW_USER, {
		update: async (cache, data) => {
			const meWithNewFollowing = produce(me, (draft) => {
				draft.following.push(you);
			});

			const youWithNewFollower = produce(you, (draft) => {
				draft.follower.push(you);
			});

			client.writeData({
				data: {
					user: meWithNewFollowing,
					otherUser: youWithNewFollower,
				},
			});
		},
	});

	const [unFollowUser] = useMutation(UNFOLLOW_USER, {
		update: async (cache, data) => {
			const meWithUnFollowing = me.following.filter((v) => v.id !== you.id);
			const youWithUnFollower = you.follower.filter((v) => v.id !== me.id);

			const newMe = produce(me, (draft) => {
				draft.following = meWithUnFollowing;
			});

			const newYou = produce(you, (draft) => {
				draft.follower = youWithUnFollower;
			});

			client.writeData({
				data: {
					user: newMe,
					otherUser: newYou,
				},
			});
		},
	});

	const follow = useCallback(() => {
		const data = {
			me: parseInt(me.id),
			you: parseInt(you.id),
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
	});

	const unFollow = useCallback(() => {
		const data = {
			me: parseInt(me.id),
			you: parseInt(you.id),
		};
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

	return (
		<div>
			<Wrapper>
				<UserInfo>
					<Row>
						<Col span={9}>
							{
								<UserImage
									src={`http://localhost:4000/${currentUser.profile}`}
								/>
							}
						</Col>
						<Col span={15}>
							<div>
								<span
									style={{
										fontSize: "30px",
										fontWeight: "700",
										color: "#262626",
									}}
								>
									{currentUser.userId}
								</span>
								<span style={{ marginLeft: "10px" }}>{currentUser.name}</span>
							</div>

							{!you ? (
								<div>
									<Button
										style={{ marginTop: "10px" }}
										onClick={() => {
											setUserUpdateModal(true);
										}}
									>
										<EditOutlined />
										개인정보 수정
									</Button>
								</div>
							) : isMeFollowYou ? (
								<Button type="danger" onClick={unFollow}>
									언팔로우
								</Button>
							) : (
								<Button type="primary" onClick={follow}>
									팔로우
								</Button>
							)}

							<CustomUl>
								<li>
									게시글<span>{currentUser.myPosts.length}</span>
								</li>

								<RefWrapper
									onMouseOver={onFollowingMouseOver}
									onMouseOut={onFollowingMouseOut}
								>
									<li>
										팔로잉<span>{currentUser.following.length}</span>
									</li>
									<ShowFollow ref={showFollowingRef}>
										<div id="header">팔로잉</div>
										<div id="items">
											{currentUser.following.map((v, i) => (
												<Item user={v} loggedInUser={me} key={i} />
											))}
										</div>
									</ShowFollow>
								</RefWrapper>
								<RefWrapper
									onMouseOver={onFollowerMouseOver}
									onMouseOut={onFollowerMouseOut}
								>
									<li>
										팔로워<span>{currentUser.follower.length}</span>
									</li>
									<ShowFollow ref={showFollowerRef}>
										<div id="header">팔로워</div>
										<div id="items">
											{currentUser.follower.map((v, i) => (
												<Item user={v} loggedInUser={me} key={i} />
											))}
										</div>
									</ShowFollow>
								</RefWrapper>
							</CustomUl>
							<div />
						</Col>
					</Row>
				</UserInfo>
				<Row>
					{currentUser.myPosts.map((v, i) => {
						return (
							<Col span={8} key={i} style={{ marginTop: "10px" }}>
								<div style={{ height: "250px" }}>
									<ImgCustom
										src={`http://localhost:4000/${v.images[0].src}`}
										onClick={onOpenModal(v)}
									></ImgCustom>
								</div>
							</Col>
						);
					})}
				</Row>
				{postModal && (
					<PostModal onCloseModal={onCloseModal} post={post} me={currentUser} />
				)}
				{userUpdateModal && (
					<UserUpdateModal
						onCloseModalProps={setUserUpdateModal}
						me={currentUser}
					/>
				)}
			</Wrapper>
		</div>
	);
};

export default User;
