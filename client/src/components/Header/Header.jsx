import React, { useState, useCallback } from "react";
import { useApolloClient, useLazyQuery } from "@apollo/react-hooks";
import OutsideClickHandler from "react-outside-click-handler";
import { Col, Row } from "antd";
import {
	UserOutlined,
	FormOutlined,
	LogoutOutlined,
	HeartOutlined,
} from "@ant-design/icons";

import { navigate } from "@reach/router";
import styled from "styled-components";
import gql from "graphql-tag";
import _ from "lodash";

import { HeaderWrapper, InstagramLogo, Search } from "./style";
import PostFormModal from "../PostFormModal";
import HeaderInput from "./HeaderInput";
import Item from "./Item";

const SearchUsers = styled.div`
	margin-top: 3px;
	background-color: #ffffff;
	border: 1px solid gray;
	position: absolute;
	z-index: 1;
	height: auto;
	width: 240px;
`;

const SEARCH_USER = gql`
	query _searchUser($userId: String!) {
		searchUsers(userId: $userId) {
			id
			userId
			name
			profile
			following {
				id
				userId
				name
				profile
			}
			follower {
				id
				userId
				name
				profile
			}
			myPosts {
				id
				content
				author {
					id
					userId
					name
					profile
				}
				images {
					id
					src
				}
				likers {
					user {
						id
						userId
						name
						profile
					}
				}
				comments {
					id
					content
					postId
					author {
						id
						userId
						name
						profile
					}
				}
			}
		}
	}
`;

const Header = () => {
	const [modalVisible, setmodalVisible] = useState(false);
	const [searchUsers, setSearchUsers] = useState([]);
	const [searchUsersVisible, setSearchUsersVisible] = useState(false);

	const client = useApolloClient();

	const [searchUser] = useLazyQuery(SEARCH_USER, {
		onCompleted: ({ searchUsers }) => {
			setSearchUsers(searchUsers);
			setSearchUsersVisible(true);
		},
	});

	const onLogout = useCallback(async () => {
		localStorage.clear();
		await client.writeData({
			data: {
				isLoggedIn: false,
				user: null,
				otherUser: null,
			},
		});
		navigate("/");
	}, [client]);

	// Header : 입력할 때마다 "onDelaySearch1 실행"만 출력,_.debounce의 long 출력 안됨
	// HeaderInput : 입력할 때마다 "onDelaySearch1 실행"만 출력,_.debounce의 long 출력 안됨
	const onDelaySearch1 = (userId) => {
		_.debounce((userId) => {}, 500);
	};

	// Header : 입력할 때마다 700ms 이후 userId 출력
	// HeaderInput : 입력하고 700ms 이후 userId 출력, 여기서 userId는 가장 마지막에 입력한 값, 클로저 ?
	//               HeaderInput에서 입력이 끝난 후 700ms 후에 userId가 출력됨
	const onDelaySearch2 = _.debounce((userId) => {
		searchUser({
			variables: { userId },
			context: {
				headers: {
					authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			},
		});
	}, 500);

	return (
		<HeaderWrapper>
			<Col md={7}>
				<InstagramLogo
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/220px-Instagram_logo_2016.svg.png"
					onClick={() => {
						navigate("/");
					}}
				/>
			</Col>

			<Col md={7}>
				<Search>
					{/* <Input.Search
						loading={loading ? true : false}
						size="small"
						style={{ width: "70%" }}
						onChange={onChangeUserId}
						value={userId}
					/> */}
					<HeaderInput onDelaySearch={onDelaySearch2} />
					{searchUsersVisible && (
						<OutsideClickHandler
							onOutsideClick={() => {
								setSearchUsersVisible(false);
							}}
						>
							<SearchUsers>
								<Item
									users={searchUsers}
									setSearchUsersVisible={setSearchUsersVisible}
								/>
							</SearchUsers>
						</OutsideClickHandler>
					)}
				</Search>
			</Col>
			<Col md={7}>
				<Row>
					<Col md={3}>
						<UserOutlined
							type="user"
							style={{ fontSize: "23px" }}
							onClick={() => {
								client.writeData({
									data: {
										otherUser: null,
									},
								});
								navigate("/user");
							}}
						/>
					</Col>
					<Col md={3}>
						<HeartOutlined type="heart" style={{ fontSize: "23px" }} />
					</Col>
					<Col md={3}>
						<FormOutlined
							type="form"
							style={{ fontSize: "23px" }}
							onClick={() => {
								setmodalVisible(true);
							}}
						/>
					</Col>
					<Col md={3}>
						<LogoutOutlined
							type="logout"
							style={{ fontSize: "23px" }}
							onClick={onLogout}
						/>
					</Col>
				</Row>
			</Col>
			{modalVisible && <PostFormModal setmodalVisibleProps={setmodalVisible} />}
		</HeaderWrapper>
	);
};

export default Header;
