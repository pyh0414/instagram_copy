import React, { useState, useCallback } from "react";
import { useLazyQuery, useApolloClient } from "@apollo/react-hooks";
import { Input, Button, message } from "antd";
import { navigate } from "@reach/router";

import { Wrapper, CustomForm } from "./style";
import { QUERY_SIGN_IN } from "../../action/query";

const SignIn = () => {
	const [userId, setChangeUserId] = useState("");
	const [userPw, setChangeUserPw] = useState("");

	const client = useApolloClient();
	const antdMessage = message;

	const [signIn] = useLazyQuery(QUERY_SIGN_IN, {
		// onCompleted: ({ signIn: { user, token, message } }) => {
		onCompleted: (data) => {
			const { user, token, message } = data.signIn;
			if (user) {
				antdMessage.success(message, 0.7);
				localStorage.setItem("token", token);
				client.writeData({
					data: {
						isLoggedIn: true,
						user,
					},
				});
			} else {
				antdMessage.error(message, 0.7);
			}
		},
	});

	const onChangeUserId = (e) => {
		setChangeUserId(e.target.value);
	};

	const onChangeUserPw = (e) => {
		setChangeUserPw(e.target.value);
	};

	const onSubmitForm = useCallback(
		(e) => {
			e.preventDefault();
			const user = { userId, userPw };
			signIn({
				variables: { user },
				context: {
					headers: {
						authorization: "Bearer pass",
					},
				},
			});

			navigate("/");
		},
		[userId, userPw, signIn]
	);

	return (
		<Wrapper>
			<CustomForm onSubmit={onSubmitForm}>
				<div>
					<br />

					<Input
						name="user-id"
						placeholder="아이디"
						value={userId}
						onChange={onChangeUserId}
						required
					/>
					<br />
				</div>
				<div>
					<br />
					<Input
						name="user-password"
						placeholder="비밀번호"
						value={userPw}
						onChange={onChangeUserPw}
						required
						type="password"
						autoComplete="on"
					/>
					<br />
				</div>
				<br />
				<Button
					type="primary"
					style={{ width: "40%", marginRight: "20%" }}
					onClick={onSubmitForm}
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
					회원가입
				</Button>
			</CustomForm>
		</Wrapper>
	);
};

export default SignIn;
