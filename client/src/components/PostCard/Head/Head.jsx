import React from "react";

import { Wrapper, ImgCustom, UserCustom } from "./style";

const Head = ({ user }) => {
	const { userId, profile } = user;
	return (
		<Wrapper>
			<ImgCustom src={`http://localhost:3060/${profile}`} />
			<UserCustom>{userId}</UserCustom>
		</Wrapper>
	);
};

export default Head;
