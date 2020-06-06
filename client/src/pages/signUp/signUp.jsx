import React, { useState, useCallback, useRef } from "react";
import { Input, Button } from "antd";
import { navigate } from "@reach/router";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { IdCheckButtonCustom, Foot, Wrapper, FormCustom } from "./style";

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

const SignUp = () => {
	const [id, setChangeId] = useState("");
	const [name, setChangeName] = useState("");
	const [password, setChangePassword] = useState("");
	const [passwordCheck, setChangePasswordCheck] = useState("");
	const [passwordError, setPasswordError] = useState(false);
	const [hasSmaeId, setHasSmaeId] = useState(false);
	const [hasSameIdChecked, setHasSameIdChecked] = useState(false);
	const [filePath, setFilePath] = useState("");
	const imageInput = useRef();

	const [uploadFile] = useMutation(UPLOAD_FILE, {
		onCompleted: (data) => {
			const filePath = data.uploadFile.filePath;
			console.log(data);
			setFilePath(filePath);
		},
	});

	const [getUser] = useLazyQuery(GET_USER, {
		onCompleted: (data) => {
			setHasSameIdChecked(true);
			if (data.user) {
				setHasSmaeId(true);
			}
		},
	});

	const onChangeId = (e) => {
		setHasSameIdChecked(false);
		setHasSmaeId(false);
		setChangeId(e.target.value);
	};

	const onChangeName = (e) => {
		setChangeName(e.target.value);
	};

	const onChangePassword = (e) => {
		setChangePassword(e.target.value);
	};
	const onChangePasswordCheck = (e) => {
		setPasswordError(e.target.value !== password);
		setChangePasswordCheck(e.target.value);
	};

	const onSubmitForm = useCallback(() => {
		console.log(id, password, passwordCheck, name);
		if (password !== passwordCheck) {
			return setPasswordError(true);
		}
	}, [id, password, passwordCheck, name]);

	const onExistingIdCheck = useCallback(() => {
		if (id.trim() === "") {
			return alert("아이디를 입력해 주세요");
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
				<IdCheckButtonCustom type="danger" onClick={onExistingIdCheck}>
					중복확인
				</IdCheckButtonCustom>
				{hasSameIdChecked
					? hasSmaeId
						? "중복된 아이디 입니다"
						: "사용가능한 아이디 입니다"
					: ""}
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
				{passwordError && (
					<div style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</div>
				)}
				<div>
					<input
						type="file"
						ref={imageInput}
						hidden
						onChange={onChangeImages}
					/>
					<br />

					<Button onClick={onClickImageUpload}>
						{/* <Icon type="upload" /> 프로필 드 */}
						프로필 업로드
					</Button>

					<br />
					{/* {profileImage}
					{profileImage && (
						<ImageCustom src={`http://localhost:3060/${profileImage}`} />
					)} */}
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
