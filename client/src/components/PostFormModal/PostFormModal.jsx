import React, { useState, useCallback, useEffect, useRef } from "react";
import { Modal, Form, Input, Button, Popconfirm, message } from "antd";
import Icon from "@ant-design/icons";

const PostForm = ({ setmodalVisibleProps }) => {
	const [modalVisible, setmodalVisible] = useState(true);
	const [text, setText] = useState("");

	const imageInput = useRef();
	const formSubmit = useRef();

	useEffect(() => {
		// if (!isAddingPost && addPostResult) {
		// 	message.success("게시글이 작성 되었습니다");
		// 	setmodalVisible(false);
		// 	return;
		// }
		// }, [isAddingPost, addPostResult]);
	}, []);

	useEffect(() => {
		return () => {
			setmodalVisible(true);
			setmodalVisibleProps(false);
			// dispatch({
			// 	type: CLEAR_POST_IMAGEPATH_REQUEST,
			// });
			// dispatch({
			// 	type: CLEAR_POST_FORM_STATUS,
			// });
		};
	}, [modalVisible]);

	const onHandleOk = useCallback(() => {
		setmodalVisible(false);
	}, modalVisible);

	const onHandleCancel = useCallback(() => {
		setmodalVisible(false);
	}, modalVisible);

	const onChangeText = useCallback((e) => {
		setText(e.target.value);
	}, []);

	const onClickImageUpload = useCallback(() => {
		// imageInput.current.click();
		// }, [imageInput.current]);
	}, []);

	const onChangeImages = useCallback((e) => {
		// const imgFormData = new FormData();
		// Object.keys(e.target.files).map((c) => {
		// 	imgFormData.append("image", e.target.files[c]);
		// });
		// dispatch({
		// 	type: UPLOAD_POST_IMAGE_REQUEST,
		// 	data: imgFormData,
		// });
	}, []);

	const onDeleteImage = useCallback(
		(index) => () => {
			// dispatch({
			// 	type: DELETE_POST_IMAGE_REQUEST,
			// 	data: index,
			// });
			message.success("삭제되었습니다");
		},
		[]
	);

	const onClickSubmit = useCallback(() => {
		if (text.trim() === "") {
			return message.error("내용을 입력해 주세요 !");
		}
		formSubmit.current.props.onSubmit();
	}, [text]);

	const onSubmitForm = useCallback(() => {
		// const data = { text, imagePaths };
		// dispatch({
		// 	type: ADD_POST_REQUEST,
		// 	data,
		// });
		// }, [text, imagePaths]);
	}, [text]);

	return (
		<>
			<Modal
				title="게시글 작성"
				centered
				visible={modalVisible}
				onOk={onHandleOk}
				onCancel={onHandleCancel}
				footer={[
					<Button type="primary" onClick={onClickSubmit}>
						공유하기
					</Button>,
				]}
			>
				<Form ref={formSubmit} onSubmit={onSubmitForm}>
					<Input.TextArea
						maxLength={140}
						placeholder="어떤 재미난 일이 있었나요 ? "
						value={text}
						onChange={onChangeText}
					/>
					<input
						type="file"
						ref={imageInput}
						multiple
						hidden
						onChange={onChangeImages}
					/>
					{/* {imagePaths.map((v, i) => {
						return (
							<Popconfirm
								title="삭제 하시겠습니까 ?"
								okText="삭제"
								cancelText="취소"
								onConfirm={onDeleteImage(i)}
								icon={<Icon type="delete" />}
								Key={i}
							>
								<div style={{ display: "inline-block" }}>
									<img
										src={`http://localhost:3060/${v}`}
										style={{ width: "200px" }}
										alt={v}
									/>
								</div>
							</Popconfirm>
						);
					})} */}
					<div>
						<Button onClick={onClickImageUpload}>
							<Icon type="upload" />
							사진 업로드
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default PostForm;
