import React from "react";
import styled from "styled-components";

const ImgCustom = styled.img`
	width: 28px;
	height: 30px;
	border-radius: 100%;
`;

const Comments = ({ comments }) => {
	const reply = comments.map((v, i) => {
		return (
			<div key={i} style={{ marginTop: "8px" }}>
				<span>
					<ImgCustom src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png" />
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
