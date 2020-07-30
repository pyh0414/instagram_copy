import React, { useCallback } from "react";
import { useApolloClient, useLazyQuery } from "@apollo/react-hooks";
import { navigate } from "@reach/router";

import { QUERY_OTHER_USER } from "../../../action/query";
import { VALIDATE_OTHER_USER } from "../../../typeValidate";

import { Wrapper, ImgCustom, UserCustom } from "./style";

const Head = ({ author }) => {
	const client = useApolloClient();

	const [searchUser] = useLazyQuery(QUERY_OTHER_USER, {
		onCompleted: ({ searchUsers }) => {
			const otherUser = searchUsers[0];
			client.writeQuery({
				query: VALIDATE_OTHER_USER,
				data: { otherUser },
			});
			navigate("/user");
		},
	});

	const onItemClick = useCallback(() => {
		const userId = author.userId;
		searchUser({
			variables: { userId },
			context: {
				headers: {
					authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			},
		});
	}, [author, searchUser]);

	return (
		<Wrapper onClick={onItemClick} style={{ cursor: "pointer" }}>
			{
				<ImgCustom
					src={`http://${process.env.REACT_APP_SERVER_DOMAIN}/${author.profile}`}
				/>
			}
			{<UserCustom>{author.userId}</UserCustom>}
		</Wrapper>
	);
};

export default Head;
