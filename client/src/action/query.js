import gql from "graphql-tag";

import { fullUserInfo, fullPostInfo, fullRoomInfo } from "../fragment";

const QUERY_ALL_POSTS = gql`
  query {
    getAllPosts {
      ...full_post_info
    }
  }
  ${fullPostInfo}
`;

const QUERY_FILE_REMOVE = gql`
  query _postFileRemove($src: String!) {
    fileRemove(src: $src)
  }
`;

const QUERY_SIGN_IN = gql`
  query _signIn($user: signInInput!) {
    signIn(user: $user) {
      accessToken
      loginResult
      user {
        ...full_user_info
      }
    }
  }
  ${fullUserInfo}
`;

const QUERY_OTHER_USER = gql`
  query _searchUser($userId: String!) {
    searchUsers(userId: $userId) {
      ...full_user_info
    }
  }
  ${fullUserInfo}
`;

const QUERY_USER_DUPLICATE_CHECK = gql`
  query _signUpGetUser($userId: String!) {
    user(userId: $userId) {
      userId
      name
    }
  }
`;

const QUERY_ALL_ROOMS = gql`
  query {
    getAllRooms {
      ...full_room_info
    }
  }
  ${fullRoomInfo}
`;

export {
  QUERY_ALL_POSTS,
  QUERY_FILE_REMOVE,
  QUERY_SIGN_IN,
  QUERY_USER_DUPLICATE_CHECK,
  QUERY_OTHER_USER,
  QUERY_ALL_ROOMS,
};
