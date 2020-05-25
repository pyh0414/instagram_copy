import React, { useCallback } from "react";
import styled from "styled-components";

import Icon from "@ant-design/icons";

const CustomIcon = styled(Icon)`
	margin-right: 40px;
`;

const Wrapper = styled.div`
	margin-top: 5px;
`;

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
