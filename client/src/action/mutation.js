import gql from "graphql-tag";

import { fullPostInfo, userInfo, followInfo } from "../fragment";

const MUTATION_CREATE_POST = gql`
	mutation _createPost($post: createPostInput!) {
		createPost(post: $post) {
			...full_post_info
		}
	}
	${fullPostInfo}
`;

const MUTATION_MULTIPLE_FILE_UPLOAD = gql`
	mutation _postMultipleFileUpload($files: [Upload!]!) {
		multipleFileUpload(files: $files)
	}
`;

const MUTATION_SINGLE_FILE_UPLOAD = gql`
	mutation _signUpSingleFileUpload($file: Upload!) {
		singleFileUpload(file: $file)
	}
`;

const MUTATION_CREATE_COMMNET = gql`
	mutation _createComment($comment: createCommentInput!) {
		createComment(comment: $comment) {
			id
			content
			postId
			author {
				...user_info
			}
		}
	}
	${userInfo}
`;

const MUTATION_CREATE_USER = gql`
	mutation _signUpCreateUser($user: createUserInput!) {
		createUser(user: $user)
	}
`;

const MUTATION_LIKE_TO_POST = gql`
	mutation _likeToPost($data: likeOrUnlikeToPostInput!) {
		likeToPost(data: $data)
	}
`;

const MUTATION_UNLIKE_TO_POST = gql`
	mutation _unLikeToPost($data: likeOrUnlikeToPostInput!) {
		unLikeToPost(data: $data)
	}
`;

const MUTATION_UPDATE_USER = gql`
	mutation _updateUser($data: updateUserInput!) {
		updateUser(data: $data) {
			name
			profile
		}
	}
`;

const MUTATION_FOLLOW_USER = gql`
	mutation _followUser($data: followUnfollowUserInput!) {
		followUser(data: $data) {
			following {
				...follow_info
			}
		}
	}
	${followInfo}
`;

const MUTATION_UNFOLLOW_USER = gql`
	mutation _unFollowUser($data: followUnfollowUserInput!) {
		unFollowUser(data: $data) {
			following {
				...follow_info
			}
		}
	}
	${followInfo}
`;

export {
	MUTATION_LIKE_TO_POST,
	MUTATION_UNLIKE_TO_POST,
	MUTATION_CREATE_POST,
	MUTATION_MULTIPLE_FILE_UPLOAD,
	MUTATION_SINGLE_FILE_UPLOAD,
	MUTATION_CREATE_COMMNET,
	MUTATION_CREATE_USER,
	MUTATION_UPDATE_USER,
	MUTATION_FOLLOW_USER,
	MUTATION_UNFOLLOW_USER,
};
