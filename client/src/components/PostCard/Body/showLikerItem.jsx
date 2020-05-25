import React, { useCallback } from "react";
import styled from "styled-components";
import { Button } from "antd";

const Wrapper = styled.div`
	margin-bottom: 13px;
	img {
		border-radius: 30%;
		width: 37px;
		height: 37px;
	}
	span {
		margin-left: 5px;
		color: black;
	}
	button {
		float: right;
	}
`;

const ShowLikerItem = ({ liker }) => {
	const onFollow = useCallback(() => {
		// dispatch({
		// 	type: FOLLOW_USER_REQUEST,
		// 	data: liker.id,
		// });
	}, []);

	const unFollow = useCallback(() => {
		// dispatch({
		// 	type: UNFOLLOW_USER_REQUEST,
		// 	data: liker.id,
		// });
	}, []);

	// const isFollowing =
	// 	followings &&
	// 	followings.some((v) => {
	// 		// 현재 liker를 내가 팔로잉 하고 있는지 확인하는 변수
	// 		return v.id === liker.id;
	// 	});

	// const isValidEqual = user && user.id != liker.id; // 좋아요 한 사람중에 나인 경우는 제외

	const isFollowing = true;
	const isValidEqual = true;
	return (
		<Wrapper>
			{isValidEqual ? (
				isFollowing ? (
					<div>
						<img src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png" />
						<span>{liker.userId}</span>
						<Button type="danger" onClick={unFollow}>
							팔로우 취소
						</Button>
					</div>
				) : (
					<div>
						<img src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c521.png" />
						<span>{liker.userId}</span>
						<Button type="danger" onClick={onFollow}>
							팔로우
						</Button>
					</div>
				)
			) : null}
		</Wrapper>
	);
};

export default ShowLikerItem;
