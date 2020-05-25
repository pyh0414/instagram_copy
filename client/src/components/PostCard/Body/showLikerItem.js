import React, { useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";

import {
  FOLLOW_USER_REQUEST,
  UNFOLLOW_USER_REQUEST
} from "../../../../reducer/user";

const Wrapper = styled.div`
  margin-bottom: 13px;
  img {
    border-radius: 30%;
    width: 37px;
    height: 37px;
  }
  span {
    margin-left: 5px;
    color: black;
  }
  button {
    float: right;
  }
`;

const ShowLikerItem = ({ liker }) => {
  const { user, followings } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const onFollow = useCallback(() => {
    dispatch({
      type: FOLLOW_USER_REQUEST,
      data: liker.id
    });
  }, []);

  const unFollow = useCallback(() => {
    dispatch({
      type: UNFOLLOW_USER_REQUEST,
      data: liker.id
    });
  }, []);

  const isFollowing =
    followings &&
    followings.some(v => {
      // 현재 liker를 내가 팔로잉 하고 있는지 확인하는 변수
      return v.id === liker.id;
    });

  const isValidEqual = user && user.id != liker.id; // 좋아요 한 사람중에 나인 경우는 제외
  return (
    <Wrapper>
      {isValidEqual ? (
        isFollowing ? (
          <div>
            <img src={`http://localhost:3060/${liker.profile}`} />
            <span>{liker.userId}</span>
            <Button type="danger" onClick={unFollow}>
              팔로우 취소
            </Button>
          </div>
        ) : (
          <div>
            <img src={`http://localhost:3060/${liker.profile}`} />
            <span>{liker.userId}</span>
            <Button type="danger" onClick={onFollow}>
              팔로우
            </Button>
          </div>
        )
      ) : null}
    </Wrapper>
  );
};

export default ShowLikerItem;
