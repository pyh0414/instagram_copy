import React, { useState, useCallback } from "react";
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

	// useEffect(() => {
	// 	!user && Router.push("/");
	// }, [user]);

	const onLogout = useCallback(() => {
		// dispatch({
		// 	type: LOG_OUT_REQUEST,
		// });
		// roomSocket && roomSocket.close();
		// chatSocket && chatSocket.close();
	}, []);

	return (
		<HeaderWrapper>
			<Col md={7}>
				<InstagramLogo
					src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png"
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
