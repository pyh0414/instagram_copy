import React from "react";

import { Wrapper, UserProfile, User } from "./style";

const UserInfo = ({ user }) => {
	return (
		<Wrapper>
			{<UserProfile src={`http://localhost:4000/${user.profile}`} />}

			<User>
				{<div style={{ fontWeight: "bold" }}>{user.userId}</div>}
				{<div style={{ color: "#A4A4A4" }}>{user.name}</div>}
			</User>
		</Wrapper>
	);
};

export default UserInfo;
