import gql from "graphql-tag";

const roomUserInfo = gql`
	fragment room_user_info on User {
		id
		userId
		profile
	}
`;

const chatUserInfo = gql`
	fragment chat_user_info on User {
		id
		userId
		profile
	}
`;

export { roomUserInfo, chatUserInfo };
