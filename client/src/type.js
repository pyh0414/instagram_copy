import gql from "graphql-tag";

export const ALL_POSTS_INFO = gql`
	query {
		allPosts {
			id
			content
			author {
				id
				profile
				userId
			}
			images {
				id
				src
			}
			comments {
				id
				content
				postId
				author {
					id
					userId
					profile
				}
			}
		}
	}
`;
