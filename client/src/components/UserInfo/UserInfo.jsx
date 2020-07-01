import React from "react";

import { Wrapper, UserProfile, User } from "./style";

const UserInfo = ({ me }) => {
	return (
		<Wrapper>
			{<UserProfile src={`http://localhost:4000/${me.profile}`} />}

			<User>
				{<div style={{ fontWeight: "bold" }}>{me.userId}</div>}
				{<div style={{ color: "#A4A4A4" }}>{me.name}</div>}
			</User>
		</Wrapper>
	);
};

export default UserInfo;
