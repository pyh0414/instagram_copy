import jwtDecode from "jwt-decode";
import axios from "axios";

import { getAccessToken, setAccessToken } from "./accessToken";
import logout from "./logout";

export let inMemoryAccessToken = "";

export const periodicallyAuthCheck = async () => {
  // n 초마다
  if (!inMemoryAccessToken) {
    inMemoryAccessToken = getAccessToken();
  }
  const { exp: accessTokenValidTime } = await jwtDecode(inMemoryAccessToken);
  if (Date.now() + 5000 > accessTokenValidTime * 1000) {
    const result = await axios.get(
      `http://${process.env.REACT_APP_SERVER_DOMAIN}/auth/accessToken`,
      {
        withCredentials: true,
      }
    );
    if (result.data.refreshTokenexpirated) {
      await axios.get(
        `http://${process.env.REACT_APP_SERVER_DOMAIN}/auth/logout`,
        {
          withCredentials: true,
        }
      );
      alert("토큰이 만료되었습니다. 다시 로그인 해주세요");
      logout();
    } else {
      setAccessToken(result.data.accessToken);
      inMemoryAccessToken = getAccessToken();
    }
  }
};
