import React, { useState, useCallback, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { Modal, Form, Input, Button, message, Popconfirm } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons";
import gql from "graphql-tag";

import { ALL_POSTS_INFO } from "../../../src/type";

const MULTIPLE_FILE_UPLOAD = gql`
	mutation _postMultipleFileUpload($files: [Upload!]!) {
		multipleFileUpload(files: $files)
	}
`;

const FILE_REMOVE = gql`
	query _postFileRemove($src: String!) {
		fileRemove(src: $src)
	}
`;

const CREATE_POST = gql`
	mutation _createPost($post: createPostInput!) {
		createPost(post: $post) {
			id
			content
			author {
				id
				profile
				userId
			}
			images {
				id
				src
				postId
			}
		}
	}
`;

const PostForm = ({ setmodalVisibleProps }) => {
	const [modalVisible, setmodalVisible] = useState(true);
	const [images, setImages] = useState([]);
	const [content, setContent] = useState("");

	const imageInput = useRef();
	const formSubmit = useRef();

	const [createPost] = useMutation(CREATE_POST, {
		update: async (cache, data) => {
			const newPost = data.data.createPost;
			const currentAllPosts = await cache.readQuery({
				query: ALL_POSTS_INFO,
			}).allPosts;

			const allPosts = [...currentAllPosts, newPost];
			cache.writeQuery({ query: ALL_POSTS_INFO, data: { allPosts } });
		},
		onCompleted: () => {
			setmodalVisibleProps(false);
			message.success("게시글을 작성하였습니다.", 0.7);
		},
	});

	const [multipleFileUpload] = useMutation(MULTIPLE_FILE_UPLOAD, {
		onCompleted: async ({ multipleFileUpload }) => {
			const newImages = await multipleFileUpload.reduce((acc, image, i) => {
				return [...acc, image];
			}, images);
			setImages(newImages);
		},
	});

	const [fileRemove] = useLazyQuery(FILE_REMOVE, {
		onCompleted: async ({ fileRemove: willRemoveImage }) => {
			const newImages = await images.filter(
				(image) => image !== willRemoveImage
			);
			setImages(newImages);
		},
	});

	const onHandleOk = useCallback(() => {
		setmodalVisible(false);
	}, []);

	const onHandleCancel = useCallback(() => {
		setmodalVisible(false);
	}, []);

	const onChangeContent = useCallback((e) => {
		setContent(e.target.value);
	}, []);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, []);

	const onChangeImages = useCallback(
		(e) => {
			const files = e.target.files;
			multipleFileUpload({ variables: { files } });
		},
		[multipleFileUpload]
	);

	const onDeleteImage = useCallback(
		(src) => () => {
			fileRemove({ variables: { src } });
		},
		[fileRemove]
	);

	const onSubmitForm = useCallback(() => {
		if (content.trim() === "") {
			return message.error("내용을 입력해 주세요");
		}
		const post = {
			content,
			images,
		};
		createPost({ variables: { post } });
	}, [content, images, createPost]);

	return (
		<>
			<Modal
				title="게시글 작성"
				centered
				visible={modalVisible}
				onOk={onHandleOk}
				onCancel={onHandleCancel}
				footer={[
					<Button type="primary" key="submit" onClick={onSubmitForm}>
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
					{images &&
						images.map((profile, index) => (
							<Popconfirm
								title="삭제 하시겠습니까 ?"
								okText="삭제"
								cancelText="취소"
								onConfirm={onDeleteImage(profile)}
								icon={<Icon type="delete" />}
								Key={index}
							>
								<div style={{ display: "inline-block" }}>
									<img
										src={`http://localhost:4000/${profile}`}
										style={{ width: "200px" }}
										alt={profile}
									/>
								</div>
							</Popconfirm>
						))}
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
