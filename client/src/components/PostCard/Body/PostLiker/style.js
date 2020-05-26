import styled from "styled-components";

export const Wrapper = styled.div`
	margin-top: 5px;
	cursor: pointer;
`;

export const ShowLikers = styled.div`
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
