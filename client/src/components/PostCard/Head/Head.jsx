import React from "react";

import { Wrapper, ImgCustom, UserCustom } from "./style";

const Head = ({ author }) => {
	return (
		<Wrapper>
			{<ImgCustom src={`http://localhost:4000/${author.profile}`} />}
			{<UserCustom>{author.userId}</UserCustom>}
		</Wrapper>
	);
};

export default Head;
