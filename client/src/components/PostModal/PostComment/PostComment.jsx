import React from "react";

import { ImgCustom } from "./style";

// const Comments = ({ comments }) => {
const Comments = () => {
	const comments = [
		{
			content: "댓글1",
			User: {
				userId: "whwlsvy12",
				profile:
					"http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png",
			},
		},
		{
			content: "댓글2",
			User: {
				userId: "asdasd!!!",
				profile:
					"http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png",
			},
		},
	];
	const reply = comments.map((v, i) => {
		return (
			<div key={i} style={{ marginTop: "8px" }}>
				<span>
					<ImgCustom
						src={`http://localhost:3060/${v.User && v.User.profile}`}
					/>
				</span>
				<span
					style={{ fontWeight: "bold", color: "#202020", marginLeft: "5px" }}
				>
					{v.User && v.User.userId}
				</span>
				<span style={{ marginLeft: "4px" }}>{v.content}</span>
			</div>
		);
	});

	return reply;
};

export default Comments;
