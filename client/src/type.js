import gql from "graphql-tag";

export const ALL_POSTS_INFO = gql`
	query {
		allPosts @client {
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
					id
					userId
					name
					profile
				}
			}
			comments {
				id
				content
				postId
				author {
					id
					userId
					name
					profile
				}
			}
		}
	}
`;
