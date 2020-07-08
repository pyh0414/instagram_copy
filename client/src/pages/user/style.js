import styled from "styled-components";

export const Wrapper = styled.div`
	width: 60%;
	margin: auto;
`;

export const UserInfo = styled.div`
	height: 300px;
	padding-top: 60px;
`;

export const UserImage = styled.img`
	height: 160px;
	width: 170px;
	border-radius: 50%;
	margin-left: 25%;
`;

export const CustomUl = styled.ul`
	display: "flex";
	list-style: none;
	padding-left: 0px;
	margin-top: 20px;

	li {
		margin-top: 10px;
		color: #848484;
		font-weight: 600;
		font-size: 16px;
		span {
			margin-left: 5px;
			color: #262626;
		}
	}
`;

export const ImgCustom = styled.img`
	width: 90%;
	height: 100%;
	cursor: pointer;
`;

export const ShowFollow = styled.div`
	background-color: #ffffff;
	border: 1px solid gray;
	border-radius: 5%;
	position: absolute;
	z-index: 1;
	height: auto;
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
		height: auto;
		padding: 20px;
	}
`;

export const RefWrapper = styled.div`
	margin-top: 5px;
	cursor: pointer;
`;
