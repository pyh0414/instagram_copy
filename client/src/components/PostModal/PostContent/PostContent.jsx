import React from "react";

import { Wrapper } from "./style";

const Contents = ({ content }) => {
	return (
		<Wrapper>
			<div style={{ fontWeight: "bold", color: "black" }}>{content}</div>
		</Wrapper>
	);
};

export default Contents;
