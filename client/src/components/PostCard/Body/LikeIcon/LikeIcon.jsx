import React, { useCallback } from "react";

import { CustomIcon, Wrapper } from "./style";

const LikeIcon = ({ postId, likers }) => {
	// const likeChecked = likers && userId && likers.find((v) => v.id === userId);

	const onToggleLike = useCallback(() => {
		// if (likeChecked) {
		// 	dispatch({
		// 		type: UNLIKE_POST_REQUEST,
		// 		data: postId,
		// 	});
		// } else {
		// 	dispatch({
		// 		type: LIKE_POST_REQUEST,
		// 		data: postId,
		// 	});
		// }
	}, []);

	return (
		<Wrapper>
			<CustomIcon
				type="heart"
				theme="twoTone"
				twoToneColor="red"
				style={{ fontSize: "27px" }}
				onClick={onToggleLike}
			/>
		</Wrapper>
	);
};

export default LikeIcon;
