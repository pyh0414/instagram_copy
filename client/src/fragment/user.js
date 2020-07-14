import gql from "graphql-tag";

import { fullPostInfo } from "./post";

const followInfo = gql`
	fragment follow_info on User {
		id
		userId
		name
		profile
	}
`;

const userInfo = gql`
	fragment user_info on User {
		id
		userId
		name
		profile
	}
`;

const fullUserInfo = gql`
	fragment full_user_info on User {
		id
		userId
		profile
		name
		following {
			...follow_info
		}
		follower {
			...follow_info
		}
		myPosts {
			...full_post_info
		}
	}
	${fullPostInfo}
	${followInfo}
`;

export { fullUserInfo, userInfo, followInfo };
