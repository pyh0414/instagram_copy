import gql from "graphql-tag";

const chatUserInfo = gql`
	fragment chat_user_info on User {
		id
		userId
		profile
	}
`;

export { chatUserInfo };
