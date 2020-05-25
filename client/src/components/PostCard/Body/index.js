import React from "react";
import styled from "styled-components";

import LikeIcon from "./LikeIcon";
import Liker from "../../../../components/PostLikers";
import Content from "../../../../components/PostContent";
import Comment from "../../../../components/PostComment";

const Wrapper = styled.div`
  width: 100%;
  padding-top: 10px;
  padding-left: 15px;
  padding-right: 20px;
`;

const Body = ({ post }) => {
  return (
    <Wrapper>
      <LikeIcon postId={post.id} likers={post.Likers} />
      <Liker likers={post.Likers} />
      <Content contents={post.content} />
      {post.Comments && post.Comments.length > 4 ? (
        <div
          style={{ marginTop: "13px", overflow: "scroll", maxHeight: "150px" }}
        >
          <Comment comments={post.Comments} />
        </div>
      ) : (
        <div style={{ marginTop: "13px" }}>
          <Comment comments={post.Comments} />
        </div>
      )}
    </Wrapper>
  );
};

export default Body;
