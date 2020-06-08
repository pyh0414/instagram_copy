import React, { useState, useCallback, useRef } from "react";
import gql from "graphql-tag";
import { Input, Button, message } from "antd";
import { navigate } from "@reach/router";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { UploadOutlined } from "@ant-design/icons";

import { Foot, Wrapper, FormCustom, ImageCustom } from "./style";

import signUpValidation from "../../utils/signUpValidation";

const GET_USER = gql`
	query($userId: String!) {
		user(query: $userId) {
			name
		}
	}
`;

const UPLOAD_FILE = gql`
	mutation($file: Upload!) {
		uploadFile(file: $file) {
			filePath
		}
	}
`;

const CREATE_USER = gql`
	mutation($user: CreateUserInput!) {
		createUser(user: $user) {
			id
			name
			password
			profile
		}
	}
`;

const SignUp = () => {
	const [id, setChangeId] = useState("");
	const [name, setChangeName] = useState("");
	const [password, setChangePassword] = useState("");
	const [passwordCheck, setChangePasswordCheck] = useState("");
	const [hasSameId, setHasSameId] = useState(false);
	const [hasSameIdChecked, setHasSameIdChecked] = useState(false);
	const [profile, setProfile] = useState("");

	const imageInput = useRef();

	const [createUser] = useMutation(CREATE_USER, {
		onCompleted: () => {
			message.success("가입 성공 되었습니다.", 0.7, () => {
				navigate("/");
			});
		},
	});
	const [uploadFile] = useMutation(UPLOAD_FILE, {
		onCompleted: (data) => {
			const filePath = data.uploadFile.filePath;
			setProfile(filePath);
		},
	});

	const [getUser] = useLazyQuery(GET_USER, {
		onCompleted: (data) => {
			setHasSameIdChecked(true);
			if (data.user) {
				setHasSameId(true);
				return message.error("중복된 아이디 입니다", 0.5);
			} else {
				setHasSameId(false);
				return message.success("사용 가능한 아이디 입니다", 0.5);
			}
		},
	});

	const onChangeId = (e) => {
		setHasSameIdChecked(false);
		setHasSameId(false);
		setChangeId(e.target.value);
	};

	const onChangeName = (e) => {
		setChangeName(e.target.value);
	};

	const onChangePassword = (e) => {
		setChangePassword(e.target.value);
	};
	const onChangePasswordCheck = (e) => {
		setChangePasswordCheck(e.target.value);
	};

	const onSubmitForm = useCallback(() => {
		if (
			signUpValidation({
				password,
				passwordCheck,
				profile,
				hasSameIdChecked,
				hasSameId,
			})
		) {
			const user = { id, name, password, profile };
			createUser({
				variables: { user },
			});
		}
	}, [id, password, passwordCheck, name, profile, hasSameIdChecked]);

	const onExistingIdCheck = useCallback(() => {
		if (id.trim() === "") {
			return message.error("아이디를 입력해 주세요");
		}
		getUser({
			variables: { userId: id },
		});
	}, [id]);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	const onChangeImages = useCallback((e) => {
		const file = e.target.files[0];
		uploadFile({ variables: { file } });
	});

	return (
		<Wrapper>
			<FormCustom onFinish={onSubmitForm}>
				<br />
				<Input
					name="user-id"
					placeholder="아이디"
					value={id}
					onChange={onChangeId}
					required
				/>
				<Button
					type="danger"
					onClick={onExistingIdCheck}
					style={{ marginTop: "4px" }}
				>
					중복확인
				</Button>
				<br />
				<div>
					<br />
					<Input
						name="user-id"
						placeholder="이름"
						value={name}
						onChange={onChangeName}
						required
					/>
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
					<br />
				</div>
				<div>
					<Input
						name="user-password-check"
						placeholder="비밀번호확인"
						value={passwordCheck}
						onChange={onChangePasswordCheck}
						required
						type="password"
					/>
				</div>
				<div>
					<input
						type="file"
						ref={imageInput}
						hidden
						onChange={onChangeImages}
					/>
					<br />
					<Button onClick={onClickImageUpload} icon={<UploadOutlined />}>
						프로필 업로드
					</Button>
					<br />
					{profile && <ImageCustom src={`http://localhost:4000/${profile}`} />}
				</div>
				<br />
				<Button type="submit" htmlType="submit" style={{ width: "100%" }}>
					가입하기
				</Button>
				<Foot>
					이미 가입하셨다면 ?
					<a
						onClick={() => {
							navigate("/");
						}}
					>
						로그인
					</a>
				</Foot>
			</FormCustom>
		</Wrapper>
	);
};

export default SignUp;
