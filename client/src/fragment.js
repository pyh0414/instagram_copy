import gql from "graphql-tag";

import { roomUserInfo, chatUserInfo } from "./fragment/room";

const userInfo = gql`
	fragment user_info on User {
		id
		userId
		name
		profile
	}
`;

const followInfo = gql`
	fragment follow_info on User {
		id
		userId
		name
		profile
	}
`;
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

const fullPostInfo = gql`
	fragment full_post_info on Post {
		id
		content
		author {
			id
			userId
			name
			profile
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
	${followInfo}
	${fullPostInfo}
`;

const fullRoomInfo = gql`
	fragment full_room_info on Room {
		id
		name
		owner {
			...room_user_info
		}
		chats {
			content
			user {
				...chat_user_info
			}
		}
	}
	${roomUserInfo}
	${chatUserInfo}
`;
export {
	userInfo,
	commentInfo,
	fullPostInfo,
	fullUserInfo,
	followInfo,
	fullRoomInfo,
};
