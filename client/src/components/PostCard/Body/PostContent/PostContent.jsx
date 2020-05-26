import React from "react";

import { Wrapper } from "./style";

const Contents = ({ contents }) => {
	return (
		<Wrapper>
			<div style={{ fontWeight: "bold", color: "black" }}>{contents}</div>
		</Wrapper>
	);
};

export default Contents;
