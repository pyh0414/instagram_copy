import gql from "graphql-tag";

import { userInfo } from "./user";

const commentInfo = gql`
	fragment comment_info on Comment {
		id
		content
		postId
		author {
			...user_info
		}
	}
	${userInfo}
`;

export { commentInfo };
