import React, { useState, useCallback } from "react";

import { Wrapper, CommentInput } from "./style";

// const Comment = ({ postId }) => {
const Comment = () => {
	const [text, setText] = useState("");

	const onChangeText = useCallback((e) => {
		setText(e.target.value);
	}, []);

	const onEnterPress = useCallback(
		(e) => {
			if (e.key === "Enter" && text.trim()) {
				const data = { text };
				// dispatch({
				// 	type: ADD_COMMENT_REQUEST,
				// 	data,
				// });
				setText("");
			}
		},
		// [text, postId]
		[text]
	);

	return (
		<Wrapper>
			<CommentInput
				type="text"
				placeholder="댓글달기..."
				value={text}
				onChange={onChangeText}
				onKeyPress={onEnterPress}
			/>
		</Wrapper>
	);
};

export default Comment;
