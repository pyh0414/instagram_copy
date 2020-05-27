import React, { useRef, useCallback } from "react";

import Item from "../LikerList/LikerList";

import { Wrapper, ShowLikers } from "./style";

const Liker = ({ likers }) => {
	const showLikersRef = useRef();
	const onLikerMouseOver = useCallback(() => {
		showLikersRef.current.style.display = "block";
	}, []);

	const onLikerMouseOut = useCallback(() => {
		showLikersRef.current.style.display = "none";
	}, []);

	return (
		<Wrapper onMouseOver={onLikerMouseOver} onMouseOut={onLikerMouseOut}>
			<span style={{ color: "black" }}>{likers.length}명</span>
			<span>이 좋아합니다</span>
			<ShowLikers ref={showLikersRef}>
				<div id="header">좋아요</div>
				<div id="items">
					{likers.length > 0 &&
						likers.map((v, i) => {
							return <Item liker={v} key={v.id} />;
						})}
				</div>
			</ShowLikers>
		</Wrapper>
	);
};

export default Liker;