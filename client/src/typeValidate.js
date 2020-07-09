import gql from "graphql-tag";

import { fullPostInfo, followInfo, fullUserInfo } from "./fragment";

const VALIDATE_ALL_POSTS = gql`
	query {
		allPosts {
			...full_post_info
		}
	}
	${fullPostInfo}
`;

const VALIDATE_LOGGED_IN_USER = gql`
	query {
		user {
			...full_user_info
		}
	}
	${fullUserInfo}
`;

const VALIDATE_OTHER_USER = gql`
	query {
		otherUser {
			...full_user_info
		}
	}
	${fullUserInfo}
`;

export { VALIDATE_ALL_POSTS, VALIDATE_LOGGED_IN_USER, VALIDATE_OTHER_USER };
