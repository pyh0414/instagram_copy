import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Input, Form, Button, message } from "antd";
import Icon from "@ant-design/icons";

const Wrapper = styled.div`
	height: 70vh;
	display: flex;
`;

const CustomForm = styled(Form)`
	margin: auto;
	width: 22%;
`;

const SignIn = () => {
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
						prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
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
						prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
						type="password"
					/>
					<br />
				</div>
				<br />
				<Button
					type="primary"
					htmlType="submit"
					style={{ width: "40%", marginRight: "20%" }}
				>
					로그인
				</Button>
				<Button type="Default" style={{ width: "40%" }}>
					{/* <Link href="/signUp">
						<a> 회원가입</a>
					</Link> */}
				</Button>
			</CustomForm>
		</Wrapper>
	);
};

export default SignUp;
