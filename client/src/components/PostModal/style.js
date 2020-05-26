import styled from "styled-components";

export const Modal = styled.div`
	position: fixed; /* Stay in place */
	z-index: 1; /* Sit on top */
	left: 0;
	top: 0;
	width: 100%; /* Full width */
	height: 100%; /* Full height */
	background-color: black;
`;

export const ModalContent = styled.div`
	background-color: #fefefe;
	margin: 15% auto; /* 15% from the top and centered */
	border: 1px solid black;
	width: 55%;
	height: 420px;
	display: flex;
`;
