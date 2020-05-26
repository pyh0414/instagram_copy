import React, { useCallback } from "react";
import { CloseOutlined } from "@ant-design/icons";

import ImageCarousel from "./ImageCarousel";
import UserInfo from "../UserInfo";
import PostContent from "./PostContent";
import PostComment from "./PostComment";

import { Modal, ModalContent } from "./style";

// const PostCarousel = ({ onCloseModal, user }) => {
const PostCarousel = ({ onCloseModal }) => {
	return (
		<Modal>
			<ModalContent>
				<div style={{ width: "65%", height: "100%" }}>
					{/* <ImageCarousel images={selectedPost.Images} /> */}
					<ImageCarousel />
				</div>
				<div style={{ width: "35%", height: "100%" }}>
					<CloseOutlined
						style={{ float: "right", margin: "8px 10px 0px 0px" }}
						onClick={() => {
							return onCloseModal();
						}}
					/>
					<div
						style={{
							borderBottom: " 1px solid rgba(0, 0, 0, 0.0975)",
							paddingTop: "14px",
							paddingBottom: "14px",
						}}
					>
						{/* <UserInfo user={user} /> */}
						<UserInfo />
					</div>

					<div
						style={{
							paddingLeft: "20px",
						}}
					>
						{/* <PostContent contents={selectedPost.content} /> */}
						<PostContent />
						<div style={{ overflow: "scroll", height: "300px" }}>
							{/* <PostComment comments={selectedPost.Comments} /> */}
							<PostComment />
						</div>
					</div>
				</div>
			</ModalContent>
		</Modal>
	);
};

export default PostCarousel;
