import React, { useState, useCallback } from "react";
import { useApolloClient, useLazyQuery } from "@apollo/react-hooks";
import OutsideClickHandler from "react-outside-click-handler";
import { Col, Row } from "antd";
import { UserOutlined, FormOutlined, LogoutOutlined } from "@ant-design/icons";
import { navigate } from "@reach/router";
import _ from "lodash";

import { QUERY_OTHER_USER } from "../../action/query";

import instagramLogo from "../../images/instagram_logo.png";
import PostFormModal from "../PostFormModal";
import HeaderInput from "./HeaderInput";
import Item from "./Item";

import {
	HeaderWrapper,
	InstagramLogo,
	Search,
	SearchUsers,
	Wrapper,
} from "./style";

const Header = () => {
	const [modalVisible, setmodalVisible] = useState(false);
	const [searchUsers, setSearchUsers] = useState([]);
	const [searchUsersVisible, setSearchUsersVisible] = useState(false);

	const client = useApolloClient();

	const [searchUser] = useLazyQuery(QUERY_OTHER_USER, {
		onCompleted: (data) => {
			const searchedUsers = data.searchUsers;

			setSearchUsers(searchedUsers);
			setSearchUsersVisible(true);
		},
	});

	const onLogout = useCallback(() => {
		localStorage.clear();
		client.writeData({
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
	// const onDelaySearch1 = (userId) => {
	// 	_.debounce((userId) => {}, 500);
	// };

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
		<Wrapper>
			<Row justify="center">
				<Col lg={20} md={20} sm={22} xs={22}>
					<Row>
						<HeaderWrapper>
							<Col xl={5} lg={5} md={4} sm={4} xs={12}>
								<InstagramLogo
									src={instagramLogo}
									onClick={() => {
										navigate("/");
									}}
								/>
							</Col>

							<Col xl={10} lg={12} md={14} sm={14} xs={0}>
								<Search>
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
							<Col xl={9} lg={7} md={6} sm={6} xs={12}>
								<Row justify="start">
									<Col xl={4} lg={6} md={8} sm={8} xs={6}>
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
									<Col xl={4} lg={6} md={8} sm={8} xs={6}>
										<FormOutlined
											type="form"
											style={{ fontSize: "23px" }}
											onClick={() => {
												setmodalVisible(true);
											}}
										/>
									</Col>
									<Col xl={4} lg={6} md={8} sm={8} xs={6}>
										<LogoutOutlined
											type="logout"
											style={{ fontSize: "23px" }}
											onClick={onLogout}
										/>
									</Col>
								</Row>
							</Col>
							{modalVisible && (
								<PostFormModal setmodalVisibleProps={setmodalVisible} />
							)}
						</HeaderWrapper>
					</Row>
				</Col>
			</Row>
		</Wrapper>
	);
};

export default Header;
