import styled from "styled-components";

export const Wrapper = styled.div`
	background: white;
	position: sticky;
	border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
	top: 0px;
	z-index: 1;
	width: 100%;
	height: 60px;
`;

export const HeaderWrapper = styled.div`
	height: 60px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const InstagramLogo = styled.img`
	width: 40px;
	height: 40px;
	display: block;
	margin: 0px auto;
	cursor: pointer;
`;

export const Search = styled.div`
	width: 70%;
	display: block;
	margin: 0px auto;
`;

export const SearchUsers = styled.div`
	margin-top: 3px;
	background-color: #ffffff;
	border: 1px solid gray;
	position: absolute;
	z-index: 1;
	height: auto;
	width: 240px;
`;
