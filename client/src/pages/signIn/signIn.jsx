import React, { useState, useCallback } from "react";
import { useLazyQuery, useApolloClient } from "@apollo/react-hooks";
import { Input, Button, message as antdMessage } from "antd";
import { navigate } from "@reach/router";

import { setAccessToken } from "../../auth/accessToken";
import { QUERY_SIGN_IN } from "../../action/query";
import { timer } from "../../index";

import { Wrapper, CustomForm } from "./style";

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
    // fetchPolicy: "network-only", // 먼저 cache를 보지 않고 바로 http 통신
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
      <CustomForm onSubmit={onSubmitForm}>
        <div>
          <br />

          <Input
            name="user-id"
            placeholder="아이디"
            value={userId}
            onChange={onChangeUserId}
            required
          />
          <br />
        </div>
        <div>
          <br />
          <Input
            name="user-password"
            placeholder="비밀번호"
            value={userPw}
            onChange={onChangeUserPw}
            required
            type="password"
            autoComplete="on"
          />
          <br />
        </div>
        <br />
        <Button
          type="primary"
          style={{ width: "40%", marginRight: "20%" }}
          onClick={onSubmitForm}
        >
          로그인
        </Button>
        <Button
          type="Default"
          style={{ width: "40%" }}
          onClick={() => {
            navigate("/signUp");
          }}
        >
          회원가입
        </Button>
      </CustomForm>
    </Wrapper>
  );
};

export default SignIn;
