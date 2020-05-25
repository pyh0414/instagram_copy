import React, { useRef, useCallback } from "react";
import styled from "styled-components";

import Item from "./showLikerItem";
const Wrapper = styled.div`
	margin-top: 5px;
	cursor: pointer;
`;

const ShowLikers = styled.div`
	background-color: #ffffff;
	border: 1px solid gray;
	border-radius: 5%;
	position: absolute;
	z-index: 1;
	height: 200px;
	width: 300px;
	display: none;

	#header {
		text-align: center;
		font-weight: bold;
		color: black;
		border-bottom: 1px solid black;
		padding-top: 6px;
		padding-bottom: 6px;
	}
	#items {
		overflow: "scroll";
		padding: 20px;
	}
`;

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
