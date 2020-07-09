import React, { useRef } from "react";
import styled from "styled-components";
import { navigate } from "@reach/router";
import { useApolloClient } from "@apollo/react-hooks";

import { VALIDATE_OTHER_USER } from "../../typeValidate";
const Wrapper = styled.div`
	padding: 10px 68px 10px 8px;
	cursor: pointer;
	border-bottom: solid 1px #dad3d3;
`;

const NoItemWrapper = styled.div`
	text-align: center;
	padding: 5px;
`;

const Img = styled.img`
	border-radius: 30%;
	width: 37px;
	height: 37px;
`;

const Span = styled.span`
	margin-left: 10px;
	font-weight: bold;
	color: black;
`;

const Item = ({ users, setSearchUsersVisible }) => {
	const client = useApolloClient();
	const itemWrapper = useRef();

	const onItemMouseOver = (e) => {
		itemWrapper.current.style.backgroundColor = "#FAFAFA";
	};

	const onItemMouseOut = () => {
		itemWrapper.current.style.backgroundColor = "#FFFFFF";
	};

	const noItem = (
		<NoItemWrapper>해당 사용자가 존재하지 않습니다.</NoItemWrapper>
	);

	const onItemClick = (user) => {
		setSearchUsersVisible(false);
		client.writeQuery({
			query: VALIDATE_OTHER_USER,
			data: { otherUser: user },
		});
		navigate("/user");
	};

	const generateItem = users.map((v, i) => {
		return (
			<Wrapper
				onMouseOver={onItemMouseOver}
				onMouseOut={onItemMouseOut}
				onClick={() => onItemClick(v)}
				ref={itemWrapper}
				key={i}
			>
				<Img src={`http://localhost:4000/${v.profile}`} />
				<Span>{v.userId}</Span>
			</Wrapper>
		);
	});

	return <div>{users.length > 0 ? generateItem : noItem}</div>;
};

export default Item;
