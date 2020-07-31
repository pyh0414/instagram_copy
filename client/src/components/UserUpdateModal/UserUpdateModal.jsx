import React, { useState, useCallback, useEffect, useRef } from "react";
import { Modal, Input, Button, message } from "antd";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import { UploadOutlined } from "@ant-design/icons";
import produce from "immer";

import { ImageCustom } from "./style";
import { VALIDATE_LOGGED_IN_USER } from "../../typeValidate";
// import { CLIENT_LOGGED_IN_AND_OTHER_USER } from "../../action/client";
import {
	MUTATION_SINGLE_FILE_UPLOAD,
	MUTATION_UPDATE_USER,
} from "../../action/mutation";

const UserUpdateModal = ({ onCloseModalProps, me }) => {
	const [name, onChangeUserName] = useState(me.name);
	const [userPw, onChangeUserPw] = useState("");
	const [userPwCheck, onChangeUserPwCheck] = useState("");
	const [profile, onChangeProfile] = useState(me.profile);
	const [modalVisible, setmodalVisible] = useState(true);

	const imageInput = useRef();
	const client = useApolloClient();

	const [updateUser] = useMutation(MUTATION_UPDATE_USER, {
		update: (cache, data) => {
			console.log(cache);
			console.log(client);
			const updatedUser = data.data.updateUser;

			const currentUser = cache.readQuery({
				query: VALIDATE_LOGGED_IN_USER,
			}).user;

			const newUser = produce(currentUser, (draft) => {
				draft.name = updatedUser.name;
			});
			console.log(newUser); // newUser의 name이 변경됨

			cache.writeQuery({
				query: VALIDATE_LOGGED_IN_USER,
				data: {
					user: newUser,
				},
			});
		},
		onCompleted: () => {
			// onCloseModalProps(false);
			message.success("회원정보를 수정하였습니다.", 0.7);
		},
	});
	const [singleFileUpload] = useMutation(MUTATION_SINGLE_FILE_UPLOAD, {
		onCompleted: (data) => {
			const filePath = data.singleFileUpload;
			onChangeProfile(filePath[0]);
		},
	});

	const onSubmitForm = useCallback(() => {
		const data = { name, userPw, profile };

		updateUser({
			variables: { data },
		});
	}, [name, userPw, profile, updateUser]);

	const handleOk = useCallback(() => {
		onCloseModalProps(false);
		setmodalVisible(false);
	}, [onCloseModalProps, setmodalVisible]);

	const handleCancel = useCallback(() => {
		onCloseModalProps(false);
		setmodalVisible(false);
	}, [onCloseModalProps, setmodalVisible]);

	const changeUserName = (e) => {
		onChangeUserName(e.target.value);
	};

	const changeUserPw = (e) => {
		onChangeUserPw(e.target.value);
	};
	const changeUserPwCheck = (e) => {
		onChangeUserPwCheck(e.target.value);
	};

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, []);

	const onChangeImages = useCallback(
		(e) => {
			const file = e.target.files[0];
			singleFileUpload({
				variables: { file },
			});
		},
		[singleFileUpload]
	);

	useEffect(() => {
		return () => {
			setmodalVisible(true);
		};
	});

	return (
		<>
			<Modal
				title="사용자 정보 수정"
				centered
				visible={modalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button type="primary" key="submit" onClick={onSubmitForm}>
						수정하기
					</Button>,
				]}
			>
				<Input
					style={{ marginBottom: "10px" }}
					name="userName"
					placeholder="이름"
					value={name}
					onChange={changeUserName}
					required
				/>

				<Input
					style={{ marginBottom: "10px" }}
					name="userPwC"
					placeholder="비밀번호"
					value={userPw}
					onChange={changeUserPw}
					required
				/>

				<Input
					style={{ marginBottom: "10px" }}
					name="userPwCheck"
					placeholder="비밀번호 확인"
					value={userPwCheck}
					onChange={changeUserPwCheck}
					required
				/>

				<input
					type="file"
					ref={imageInput}
					multiple
					hidden
					onChange={onChangeImages}
				/>

				{profile && <ImageCustom src={`http://localhost:4000/${profile}`} />}

				<div>
					<Button onClick={onClickImageUpload} icon={<UploadOutlined />}>
						사진 업로드
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default UserUpdateModal;
