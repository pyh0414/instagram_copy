import React from "react";
import { CloseOutlined } from "@ant-design/icons";

import ImageCarousel from "./ImageCarousel";
import UserInfo from "../UserInfo";
import PostContent from "./PostContent";
import PostComment from "./PostComment";

import { Modal, ModalContent } from "./style";

const PostCarousel = ({ onCloseModal, post, me }) => {
	return (
		<Modal>
			<ModalContent>
				<div style={{ width: "65%", height: "100%" }}>
					<ImageCarousel images={post.images} />
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
						<UserInfo loggedInUser={me} />
					</div>

					<div
						style={{
							paddingLeft: "20px",
						}}
					>
						<PostContent content={post.content} />

						<div style={{ overflow: "scroll", height: "270px" }}>
							<PostComment comments={post.comments} />
						</div>
					</div>
				</div>
			</ModalContent>
		</Modal>
	);
};

export default PostCarousel;
