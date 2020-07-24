import React, { useRef, useCallback } from "react";

import Item from "../FollowUnfollowUser";

import { ShowLikers } from "./style";

const Liker = ({ likers, user }) => {
	const showLikersRef = useRef();
	const onLikerMouseOver = useCallback(() => {
		showLikersRef.current.style.display = "block";
	}, []);

	const onLikerMouseOut = useCallback(() => {
		showLikersRef.current.style.display = "none";
	}, []);

	return (
		<div
			onMouseOver={onLikerMouseOver}
			onMouseOut={onLikerMouseOut}
			style={{ marginTop: "5px", cursor: "pointer" }}
		>
			<span style={{ color: "black" }}>{likers.length}명</span>
			<span>이 좋아합니다</span>
			<ShowLikers ref={showLikersRef}>
				<div id="header">좋아요</div>
				<div id="items">
					{likers.map((v, i) => {
						return <Item user={v.user} loggedInUser={user} key={i} />;
					})}
				</div>
			</ShowLikers>
		</div>
	);
};

export default Liker;
