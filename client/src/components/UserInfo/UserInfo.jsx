import React from "react";

import { Wrapper, UserProfile, User } from "./style";

const UserInfo = () => {
	const user = {
		userId: "whwlsvy12",
		name: "박연호",
	};
	return (
		<Wrapper>
			{/* {user && <UserProfile src={`http://localhost:3060/${user.profile}`} />} */}
			{user && (
				<UserProfile
					src={
						"https://blog.naver.com/dooboo7178?Redirect=Log&logNo=221853498343"
					}
				/>
			)}
			<User>
				{user && <div style={{ fontWeight: "bold" }}>{user.userId}</div>}
				{user && <div style={{ color: "#A4A4A4" }}>{user.name}</div>}
			</User>
		</Wrapper>
	);
};

export default UserInfo;
