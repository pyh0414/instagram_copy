import React from "react";

import { Wrapper, UserProfile, User } from "./style";

const UserInfo = ({ loggedInUser }) => {
	return (
		<Wrapper>
			{<UserProfile src={`http://localhost:4000/${loggedInUser.profile}`} />}

			<User>
				{<div style={{ fontWeight: "bold" }}>{loggedInUser.userId}</div>}
				{<div style={{ color: "#A4A4A4" }}>{loggedInUser.name}</div>}
			</User>
		</Wrapper>
	);
};

export default UserInfo;
