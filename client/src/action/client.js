import gql from "graphql-tag";
import { fullPostInfo, fullUserInfo } from "../fragment";

const IS_LOGGED_IN = gql`
	query {
		isLoggedIn @client
	}
`;

const CLIENT_ALL_POSTS = gql`
	query {
		allPosts @client {
			...full_post_info
		}
	}
	${fullPostInfo}
`;

const CLIENT_LOGGED_IN_USER = gql`
	query {
		user @client {
			...full_user_info
		}
	}
	${fullUserInfo}
`;

const CLIENT_OTHER_USER = gql`
	query {
		otherUser @client {
			...full_user_info
		}
	}
	${fullUserInfo}
`;

const CLIENT_LOGGED_IN_AND_OTHER_USER = gql`
	query {
		user @client {
			...full_user_info
		}
		otherUser @client {
			...full_user_info
		}
	}
	${fullUserInfo}
`;

export {
	IS_LOGGED_IN,
	CLIENT_ALL_POSTS,
	CLIENT_LOGGED_IN_USER,
	CLIENT_OTHER_USER,
	CLIENT_LOGGED_IN_AND_OTHER_USER,
};
