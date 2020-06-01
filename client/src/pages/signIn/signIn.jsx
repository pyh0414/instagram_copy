import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { navigate } from "@reach/router";

import { Wrapper, CustomForm } from "./style";

const SignIn = ({ onLoginStatus }) => {
	const [id, setChangeId] = useState("");
	const [password, setChangePassword] = useState("");
	useEffect(() => {
		// if (hasLoginRequestFinished) {
		// 	if (user) {
		// 		dispatch({
		// 			type: CONNECT_SOCKET_REQUEST,
		// 		});
		// 		message.success("로그인 되었습니다");
		// 		Router.push("/home");
		// 	} else {
		// 		message.success("아이디 또는 비밀번호를 확인해 주세요");
		// 	}
		// }
		// }, [user, hasLoginRequestFinished]);
	}, []);

	const onChangeId = (e) => {
		setChangeId(e.target.value);
	};

	const onChangePassword = (e) => {
		setChangePassword(e.target.value);
	};

	const onSubmitForm = (e) => {
		e.preventDefault();
		// dispatch({
		// 	type: LOG_IN_REQUEST,
		// 	data: {
		// 		id,
		// 		password,
		// 	},
		// });
		setChangeId("");
		setChangePassword("");
	};

	return (
		<Wrapper>
			<CustomForm onSubmit={onSubmitForm}>
				<div>
					<br />

					<Input
						name="user-id"
						placeholder="이메일"
						value={id}
						onChange={onChangeId}
						required
					/>
					<br />
				</div>
				<div>
					<br />
					<Input
						name="user-password"
						placeholder="비밀번호"
						value={password}
						onChange={onChangePassword}
						required
						type="password"
					/>
					<br />
				</div>
				<br />
				<Button
					type="primary"
					htmlType="submit"
					style={{ width: "40%", marginRight: "20%" }}
					onClick={() => {
						onLoginStatus();
					}}
				>
					로그인
				</Button>
				<Button
					type="Default"
					style={{ width: "40%" }}
					onClick={() => {
						navigate("/signUp");
					}}
				>
					<a> 회원가입</a>
				</Button>
			</CustomForm>
		</Wrapper>
	);
};

export default SignIn;
