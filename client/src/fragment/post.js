import gql from "graphql-tag";

import { userInfo, fullUserInfo } from "./user";
import { commentInfo } from "./comment";

const fullPostInfo = gql`
	fragment full_post_info on Post {
		id
		content
		author {
			...full_user_info
		}
		images {
			id
			src
		}
		likers {
			user {
				...user_info
			}
		}
		comments {
			...comment_info
		}
	}
	${userInfo}
	${commentInfo}
	${fullUserInfo}
`;

export { fullPostInfo };
