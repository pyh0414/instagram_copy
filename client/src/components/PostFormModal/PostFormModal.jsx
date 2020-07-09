import React, { useState, useCallback, useEffect, useRef } from "react";
import { Modal, Form, Input, Button, message, Popconfirm } from "antd";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { useApolloClient } from "@apollo/react-hooks";
import { UploadOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons";
import produce from "immer";

import { VALIDATE_ALL_POSTS } from "../../typeValidate";
import {
	MUTATION_CREATE_POST,
	MUTATION_MULTIPLE_FILE_UPLOAD,
	MUTATION_SINGLE_FILE_UPLOAD,
} from "../../action/mutation";
import { QUERY_FILE_REMOVE } from "../../action/query";
import { VALIDATE_LOGGED_IN_USER } from "../../typeValidate";

const PostForm = ({ setmodalVisibleProps }) => {
	const [modalVisible, setmodalVisible] = useState(true);
	const [images, setImages] = useState([]);
	const [content, setContent] = useState("");

	const imageInput = useRef();
	const formSubmit = useRef();

	const client = useApolloClient();

	const [createPost] = useMutation(MUTATION_CREATE_POST, {
		update: async (cache, data) => {
			const newPost = data.data.createPost;
			const currentAllPosts = await cache.readQuery({
				query: VALIDATE_ALL_POSTS,
			}).allPosts;

			const user = await cache.readQuery({
				query: VALIDATE_LOGGED_IN_USER,
			}).user;

			const allPosts = [newPost, ...currentAllPosts];

			const userWithNewPost = produce(user, (draft) => {
				draft.myPosts.push(newPost);
			});

			client.writeQuery({
				query: VALIDATE_LOGGED_IN_USER,
				data: { user: userWithNewPost },
			});
			client.writeQuery({ query: VALIDATE_ALL_POSTS, data: { allPosts } });
		},
		onCompleted: () => {
			setmodalVisibleProps(false);
			message.success("게시글을 작성하였습니다.", 0.7);
		},
	});

	const [singleFileUpload] = useMutation(MUTATION_SINGLE_FILE_UPLOAD, {
		onCompleted: ({ singleFileUpload }) => {
			setImages(singleFileUpload);
		},
	});

	const [multipleFileUpload] = useMutation(MUTATION_MULTIPLE_FILE_UPLOAD, {
		onCompleted: async ({ multipleFileUpload }) => {
			const newImages = await multipleFileUpload.reduce((acc, image, i) => {
				return [...acc, image];
			}, images);
			setImages(newImages);
		},
	});

	const [fileRemove] = useLazyQuery(QUERY_FILE_REMOVE, {
		onCompleted: async ({ fileRemove: willRemoveImage }) => {
			const newImages = await images.filter(
				(image) => image !== willRemoveImage
			);
			setImages(newImages);
		},
	});

	const onHandleOk = useCallback(() => {
		setmodalVisibleProps(false);
		setmodalVisible(false);
	}, [setmodalVisibleProps, setmodalVisible]);

	const onHandleCancel = useCallback(() => {
		setmodalVisibleProps(false);
		setmodalVisible(false);
	}, [setmodalVisibleProps, setmodalVisible]);

	const onChangeContent = useCallback((e) => {
		setContent(e.target.value);
	}, []);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, []);

	const onChangeImages = useCallback(
		(e) => {
			const files = e.target.files;
			if (files.length > 1) {
				multipleFileUpload({
					variables: { files },
					context: {
						headers: {
							authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					},
				});
			} else {
				singleFileUpload({
					variables: { file: files[0] },
					context: {
						headers: {
							authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					},
				});
			}
		},
		[singleFileUpload, multipleFileUpload]
	);

	const onDeleteImage = useCallback(
		(src) => () => {
			fileRemove({
				variables: { src },
				context: {
					headers: {
						authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				},
			});
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
		setImages([]);
		createPost({
			variables: { post },
			context: {
				headers: {
					authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			},
		});
	}, [content, images, createPost]);

	useEffect(() => {
		return () => {
			setmodalVisible(true);
		};
	});
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
					{images.map((profile, index) => (
						<div key={index} style={{ display: "inline-block" }}>
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
						</div>
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
