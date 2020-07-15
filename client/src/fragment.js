import gql from "graphql-tag";

import { roomUserInfo } from "./fragment/room";
import { chatUserInfo } from "./fragment/chat";

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

const fullChatInfo = gql`
	fragment full_chat_info on Chat {
		content
		user {
			...chat_user_info
		}
	}
	${chatUserInfo}
`;

const fullRoomInfo = gql`
	fragment full_room_info on Room {
		id
		name
		owner {
			...room_user_info
		}
		chats {
			...full_chat_info
		}
	}
	${roomUserInfo}
	${chatUserInfo}
	${fullChatInfo}
`;
export {
	userInfo,
	commentInfo,
	fullPostInfo,
	fullUserInfo,
	followInfo,
	fullRoomInfo,
	fullChatInfo,
};
