import React, { useState, useCallback, useRef } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/react-hooks";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { Row, Col, Button, Divider } from "antd";
import produce from "immer";

import { CLIENT_LOGGED_IN_AND_OTHER_USER } from "../../action/client";
import {
	MUTATION_FOLLOW_USER,
	MUTATION_UNFOLLOW_USER,
} from "../../action/mutation";

import PostModal from "../../components/PostModal";
import UserUpdateModal from "../../components/UserUpdateModal";
import Item from "../../components/PostCard/Body/FollowUnfollowUser";
import Header from "../../components/Header";

import {
	UserImage,
	CustomUl,
	ImgCustom,
	RefWrapper,
	ShowFollow,
	Info,
	Wrapper,
	UserImageWrapper,
	UserInfoWrapper,
	PostWrapper,
} from "./style";

const User = () => {
	const [postModal, setPostModal] = useState(false);
	const [userUpdateModal, setUserUpdateModal] = useState(false);
	const [post, setPost] = useState(null);

	const showFollowingRef = useRef();
	const showFollowerRef = useRef();

	const client = useApolloClient();
	const { data } = useQuery(CLIENT_LOGGED_IN_AND_OTHER_USER);

	const me = data.user;
	const you = data.otherUser;

	let currentPageUser = me;
	let isMeFollowYou;

	if (you) {
		isMeFollowYou = me.following.some((v) => {
			return v.id === you.id;
		});
		currentPageUser = you;
	}
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

	const [followUser] = useMutation(MUTATION_FOLLOW_USER, {
		update: (cache, data) => {
			const result = data.data.followUser;

			const newMe = produce(me, (draft) => {
				draft.following = result.me.following;
			});

			const newYou = produce(you, (draft) => {
				draft.follower = result.you.follower;
			});

			client.writeData({
				data: {
					user: newMe,
					otherUser: newYou,
				},
			});
		},
	});

	const [unFollowUser] = useMutation(MUTATION_UNFOLLOW_USER, {
		update: async (cache, data) => {
			const result = data.data.unFollowUser;

			const newMe = produce(me, (draft) => {
				draft.following = result.me.following;
			});

			const newYou = produce(you, (draft) => {
				draft.follower = result.you.follower;
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
	}, [followUser, me, you]);

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
	}, [unFollowUser, me, you]);

	return (
		<>
			<Header />
			<Wrapper>
				<Row justify="center">
					<Col lg={16} md={16} xs={16}>
						<Info>
							<UserImageWrapper>
								<UserImage
									src={`http://localhost:4000/${currentPageUser.profile}`}
								/>
							</UserImageWrapper>

							<UserInfoWrapper>
								<span
									style={{
										fontSize: "30px",
										fontWeight: "700",
										color: "#262626",
									}}
								>
									{currentPageUser.userId}
								</span>
								<span style={{ marginLeft: "5px", marginRight: "10px" }}>
									{currentPageUser.name}
								</span>

								{!you || (you && you.id === me.id) ? (
									<></>
								) : /* <Button
										style={{ marginTop: "10px" }}
										onClick={() => {
											setUserUpdateModal(true);
										}}
									>
										<EditOutlined />
										개인정보 수정
									</Button> */

								isMeFollowYou ? (
									<Button
										type="danger"
										icon={<UserDeleteOutlined />}
										onClick={unFollow}
									>
										언팔로우
									</Button>
								) : (
									<Button
										type="primary"
										icon={<UserAddOutlined />}
										onClick={follow}
									>
										팔로우
									</Button>
								)}

								<CustomUl>
									<li>
										게시글<span>{currentPageUser.myPosts.length}</span>
									</li>

									<RefWrapper
										onMouseOver={onFollowingMouseOver}
										onMouseOut={onFollowingMouseOut}
									>
										<li>
											팔로잉<span>{currentPageUser.following.length}</span>
										</li>
										<ShowFollow ref={showFollowingRef}>
											<div id="header">팔로잉</div>
											<div id="items">
												{currentPageUser.following.map((v, i) => (
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
											팔로워<span>{currentPageUser.follower.length}</span>
										</li>
										<ShowFollow ref={showFollowerRef}>
											<div id="header">팔로워</div>
											<div id="items">
												{currentPageUser.follower.map((v, i) => (
													<Item user={v} loggedInUser={me} key={i} />
												))}
											</div>
										</ShowFollow>
									</RefWrapper>
								</CustomUl>
							</UserInfoWrapper>
						</Info>
						<div />

						<Divider
							orientation="left"
							style={{ borderBottom: "1px solid rgba(0,0,0,0.0975)" }}
						></Divider>
						<PostWrapper>
							<Row gutter={[24, 32]}>
								{currentPageUser.myPosts.map((v, i) => {
									return (
										<Col lg={8} sm={24}>
											<ImgCustom
												src={`http://localhost:4000/${v.images[0].src}`}
												onClick={onOpenModal(v)}
												key={i}
											></ImgCustom>
										</Col>
									);
								})}
							</Row>
						</PostWrapper>
						{postModal && (
							<PostModal
								onCloseModal={onCloseModal}
								post={post}
								me={currentPageUser}
							/>
						)}
						{userUpdateModal && (
							<UserUpdateModal onCloseModalProps={setUserUpdateModal} me={me} />
						)}
					</Col>
				</Row>
			</Wrapper>
		</>
	);
};

export default User;
