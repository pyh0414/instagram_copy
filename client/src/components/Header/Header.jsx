import React, { useState, useCallback } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { Col, Input, Row } from "antd";
import {
	UserOutlined,
	FormOutlined,
	LogoutOutlined,
	HeartOutlined,
} from "@ant-design/icons";
import { navigate } from "@reach/router";

import { HeaderWrapper, InstagramLogo, Search } from "./style";
import PostFormModal from "../PostFormModal";

const Header = () => {
	const [modalVisible, setmodalVisible] = useState(false);

	const client = useApolloClient();

	const onLogout = useCallback(() => {
		localStorage.clear();
		client.writeData({
			data: {
				isLoggedIn: false,
				user: null,
			},
		});
	}, [client]);

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
					<Input.Search size="small" style={{ width: "70%" }} />
				</Search>
			</Col>
			<Col md={7}>
				<Row>
					<Col md={3}>
						<UserOutlined
							type="user"
							style={{ fontSize: "23px" }}
							onClick={() => {
								navigate("/profile");
								// return Router.push("/profile");
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
