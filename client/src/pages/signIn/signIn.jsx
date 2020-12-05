import React, { useState, useCallback } from "react";
import { useLazyQuery, useApolloClient } from "@apollo/react-hooks";
import { message as antdMessage } from "antd";
import { navigate } from "@reach/router";

import { setAccessToken } from "../../auth/accessToken";
import { QUERY_SIGN_IN } from "../../action/query";
import { timer } from "../../index";

import { LoginForm, TextBox, Wrapper, LoginButton, BottomText } from "./style";

const SignIn = () => {
  const [userId, setChangeUserId] = useState("");
  const [userPw, setChangeUserPw] = useState("");

  const client = useApolloClient();

  const [signIn] = useLazyQuery(QUERY_SIGN_IN, {
    onCompleted: (data) => {
      const { user, accessToken, loginResult } = data.signIn;
      if (loginResult) {
        timer.start(5000);
        setAccessToken(accessToken); // 메모리에 access token 저장
        client.writeData({
          data: {
            user,
          },
        });
        antdMessage.success("로그인 되었습니다.", 0.7);
        navigate("/main");
      } else {
        antdMessage.error("사용자 정보를 다시 확인해 주세요.", 0.7);
      }
    },
    fetchPolicy: "network-only", // 먼저 cache를 보지 않고 바로 http 통신
  });

  const onChangeUserId = useCallback((e) => {
    setChangeUserId(e.target.value);
  }, []);

  const onChangeUserPw = useCallback((e) => {
    setChangeUserPw(e.target.value);
  }, []);

  const onSubmitForm = useCallback(
    async (e) => {
      const user = { userId, userPw };
      signIn({
        variables: { user },
      });
    },
    [userId, userPw, signIn]
  );

  return (
    <Wrapper>
      <LoginForm onSubmit={onSubmitForm}>
        <h1>Login</h1>
        <TextBox>
          <input
            type="text"
            name="user-id"
            value={userId}
            placeholder="Username"
            onChange={onChangeUserId}
            required
            autocomplete="off"
          />
          <span data-placeholder="Username"></span>
        </TextBox>
        <TextBox>
          <input
            name="user-password"
            value={userPw}
            onChange={onChangeUserPw}
            required
            placeholder="Password"
            type="Password"
            autocomplete="off"
          />
          <span data-placeholder="Password"></span>
        </TextBox>
        <LoginButton onClick={onSubmitForm}>로그인</LoginButton>
        <BottomText>
          계정이 없으신가요 ?{" "}
          <span
            onClick={() => {
              navigate("/signUp");
            }}
          >
            회원가입
          </span>
        </BottomText>
        {/* <Button
          type="Default"
          style={{ width: "40%" }}
          onClick={() => {
            navigate("/signUp");
          }}
        >
          회원가입
        </Button> */}
      </LoginForm>
    </Wrapper>
  );
};

export default SignIn;
