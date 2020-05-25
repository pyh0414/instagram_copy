import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Input } from "antd";

import { ADD_COMMENT_REQUEST } from "../../../../reducer/post";

const Wrapper = styled.div`
  margin-top: 15px;
  height: 40px;
`;

const CommentInput = styled(Input)`
  height: 100%;
  width: 100%;
`;

const Comment = ({ postId }) => {
  const [text, setText] = useState("");

  const dispatch = useDispatch();

  const onChangeText = useCallback(e => {
    setText(e.target.value);
  }, []);

  const onEnterPress = useCallback(
    e => {
      if (e.key === "Enter" && text.trim()) {
        const data = { postId, text };
        dispatch({
          type: ADD_COMMENT_REQUEST,
          data
        });
        setText("");
      }
    },
    [text, postId]
  );

  return (
    <Wrapper>
      <CommentInput
        type="text"
        placeholder="댓글달기..."
        value={text}
        onChange={onChangeText}
        onKeyPress={onEnterPress}
      />
    </Wrapper>
  );
};

export default Comment;
