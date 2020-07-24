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
		<>
			<span
				onMouseOver={onLikerMouseOver}
				onMouseOut={onLikerMouseOut}
				style={{ color: "black", marginTop: "5px", cursor: "pointer" }}
			>
				{likers.length}명
			</span>
			<span>이 좋아합니다</span>
			<ShowLikers ref={showLikersRef}>
				<div id="header">좋아요</div>
				<div id="items">
					{likers.map((v, i) => {
						return <Item user={v.user} loggedInUser={user} key={i} />;
					})}
				</div>
			</ShowLikers>
		</>
	);
};

export default Liker;
