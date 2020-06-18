import React, { useState, useCallback } from "react";
import { useLazyQuery, useQuery, useApolloClient } from "@apollo/react-hooks";
import { Input, Button, message } from "antd";
import { navigate } from "@reach/router";
import gql from "graphql-tag";

import { Wrapper, CustomForm } from "./style";
const antdMessage = message;
const SIGN_IN = gql`
	query _signIn($user: signInInput!) {
		signIn(user: $user) {
			user {
				userId
				name
				userPw
				profile
			}
			token
			message
		}
	}
`;

const SignIn = () => {
	const [userId, setChangeUserId] = useState("");
	const [userPw, setChangeUserPw] = useState("");

	const client = useApolloClient();

	const [signIn] = useLazyQuery(SIGN_IN, {
		onCompleted: ({ signIn: { user, token, message } }) => {
			console.log(user, token, message);
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
				antdMessage.error(message);
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
			});
		},
		[userId, userPw]
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
					<a> 회원가입</a>
				</Button>
			</CustomForm>
		</Wrapper>
	);
};

export default SignIn;
