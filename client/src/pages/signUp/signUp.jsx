import React, { useState, useCallback, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { UploadOutlined } from "@ant-design/icons";
import { Input, Button, message } from "antd";
import { navigate } from "@reach/router";
import gql from "graphql-tag";

import { Foot, Wrapper, FormCustom, ImageCustom } from "./style";

import signUpValidation from "../../utils/signUpValidation";

const GET_USER = gql`
	query _signUpGetUser($userId: String!) {
		user(userId: $userId) {
			userId
			name
		}
	}
`;

const SINGLE_FILE_UPLOAD = gql`
	mutation _signUpSingleFileUpload($file: Upload!) {
		singleFileUpload(file: $file)
	}
`;

const CREATE_USER = gql`
	mutation _signUpCreateUser($user: createUserInput!) {
		createUser(user: $user)
	}
`;

const SignUp = () => {
	const [userId, setChangeUserId] = useState("");
	const [name, setChangeName] = useState("");
	const [userPw, setChangeuserPw] = useState("");
	const [userPwCheck, setChangeuserPwCheck] = useState("");
	const [hasSameId, setHasSameId] = useState(false);
	const [hasSameIdChecked, setHasSameIdChecked] = useState(false);
	const [profile, setProfile] = useState("");

	const imageInput = useRef();

	const [createUser] = useMutation(CREATE_USER, {
		onCompleted: ({ createUser }) => {
			if (createUser) {
				message.success("가입 성공 되었습니다.", 0.7, () => {
					navigate("/");
				});
			} else {
				message.error("가입에 실패하였습니다.", 0.7, () => {
					throw new Error("가입에 실패하였습니다.");
				});
			}
		},
	});
	const [singleFileUpload] = useMutation(SINGLE_FILE_UPLOAD, {
		onCompleted: (data) => {
			const filePath = data.singleFileUpload;
			setProfile(filePath[0]);
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
		setChangeUserId(e.target.value);
	};

	const onChangeName = (e) => {
		setChangeName(e.target.value);
	};

	const onChangeuserPw = (e) => {
		setChangeuserPw(e.target.value);
	};
	const onChangeuserPwCheck = (e) => {
		setChangeuserPwCheck(e.target.value);
	};

	const onSubmitForm = useCallback(() => {
		if (
			signUpValidation({
				userPw,
				userPwCheck,
				profile,
				hasSameIdChecked,
				hasSameId,
			})
		) {
			const user = { userId, name, userPw, profile };
			createUser({
				variables: { user },
			});
		}
	}, [
		userId,
		userPw,
		userPwCheck,
		name,
		profile,
		hasSameIdChecked,
		createUser,
		hasSameId,
	]);

	const onExistingIdCheck = useCallback(() => {
		if (userId.trim() === "") {
			return message.error("아이디를 입력해 주세요");
		}
		getUser({
			variables: { userId },
		});
	}, [userId, getUser]);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, []);

	const onChangeImages = useCallback(
		(e) => {
			const file = e.target.files[0];
			singleFileUpload({ variables: { file } });
		},
		[singleFileUpload]
	);

	return (
		<Wrapper>
			<FormCustom onFinish={onSubmitForm}>
				<br />
				<Input
					name="user-id"
					placeholder="아이디"
					value={userId}
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
						name="user-userPw"
						placeholder="비밀번호"
						value={userPw}
						onChange={onChangeuserPw}
						required
						type="password"
					/>
					<br />
					<br />
				</div>
				<div>
					<Input
						name="user-userPw-check"
						placeholder="비밀번호확인"
						value={userPwCheck}
						onChange={onChangeuserPwCheck}
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
					<div
						onClick={() => {
							navigate("/");
						}}
					>
						로그인
					</div>
				</Foot>
			</FormCustom>
		</Wrapper>
	);
};

export default SignUp;
