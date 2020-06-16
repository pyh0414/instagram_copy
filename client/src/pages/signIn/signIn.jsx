import React, { useState, useCallback } from "react";
import { Input, Button } from "antd";
import { navigate } from "@reach/router";
import gql from "graphql-tag";
import { useLazyQuery, useApolloClient } from "@apollo/react-hooks";

import { Wrapper, CustomForm } from "./style";

const SIGN_IN = gql`
	query($user: signInInput!) {
		signIn(user: $user) {
			user {
				id
				name
				password
				profile
			}
			token
		}
	}
`;

const SignIn = () => {
	const [id, setChangeId] = useState("");
	const [password, setChangePassword] = useState("");

	const cache = useApolloClient();

	const [signIn] = useLazyQuery(SIGN_IN, {
		onCompleted: ({ signIn: { user, token } }) => {
			localStorage.setItem("token", token);
			cache.writeData({
				data: {
					user,
				},
			});
		},
	});

	const onChangeId = (e) => {
		setChangeId(e.target.value);
	};

	const onChangePassword = (e) => {
		setChangePassword(e.target.value);
	};

	const onSubmitForm = useCallback(
		(e) => {
			e.preventDefault();
			const user = { id, password };
			signIn({
				variables: { user },
			});
		},
		[id, password]
	);

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
