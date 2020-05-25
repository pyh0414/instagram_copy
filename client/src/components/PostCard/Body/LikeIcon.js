import React, { useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { Icon } from "antd";

import {
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST
} from "../../../../reducer/post";

const CustomIcon = styled(Icon)`
  margin-right: 40px;
`;

const Wrapper = styled.div`
  margin-top: 5px;
`;

const LikeIcon = ({ postId, likers }) => {
  const dispatch = useDispatch();

  const userId = useSelector(state => state.user.user && state.user.user.id);

  const likeChecked = likers && userId && likers.find(v => v.id === userId);

  const onToggleLike = useCallback(() => {
    if (likeChecked) {
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: postId
      });
    } else {
      dispatch({
        type: LIKE_POST_REQUEST,
        data: postId
      });
    }
  }, [likeChecked]);

  return (
    <Wrapper>
      <CustomIcon
        type="heart"
        theme={likeChecked ? "twoTone" : "outlined"}
        twoToneColor="red"
        style={{ fontSize: "27px" }}
        onClick={onToggleLike}
      />
    </Wrapper>
  );
};

export default LikeIcon;
