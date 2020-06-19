import React, { useState, useCallback, useEffect, useRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Modal, Form, Input, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import gql from "graphql-tag";

const MULTIPLE_FILE_UPLOAD = gql`
	mutation _postMultipleFileUpload($files: [Upload!]!) {
		multipleFileUpload(files: $files)
	}
`;

const PostForm = ({ setmodalVisibleProps }) => {
	const [modalVisible, setmodalVisible] = useState(true);
	const [images, setImages] = useState([]);
	const [content, setContent] = useState("");

	const imageInput = useRef();
	const formSubmit = useRef();

	const [multipleFileUpload] = useMutation(MULTIPLE_FILE_UPLOAD);

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

	const onChangeContent = useCallback((e) => {
		setContent(e.target.value);
	}, []);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	const onChangeImages = useCallback((e) => {
		const files = e.target.files;
		multipleFileUpload({ variables: { files } });
	});

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

	const onSubmitForm = useCallback(() => {
		if (content.trim() === "") {
			return message.error("내용을 입력해 주세요");
		}
	}, [content]);

	// const onSubmitForm = useCallback(() => {
	// 	// const data = { text, imagePaths };
	// 	// dispatch({
	// 	// 	type: ADD_POST_REQUEST,
	// 	// 	data,
	// 	// });
	// 	// }, [text, imagePaths]);
	// }, [content]);

	return (
		<>
			<Modal
				title="게시글 작성"
				centered
				visible={modalVisible}
				onOk={onHandleOk}
				onCancel={onHandleCancel}
				footer={[
					<Button type="primary" onClick={onSubmitForm}>
						공유하기
					</Button>,
				]}
			>
				<Form ref={formSubmit} onSubmit={onSubmitForm}>
					<Input.TextArea
						maxLength={140}
						placeholder="어떤 재미난 일이 있었나요 ? "
						value={content}
						onChange={onChangeContent}
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
						<Button onClick={onClickImageUpload} icon={<UploadOutlined />}>
							사진 업로드
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default PostForm;
