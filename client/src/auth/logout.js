import { timer } from "../index";
import { navigate } from "@reach/router";

import { setAccessToken } from "../auth/accessToken";

export default () => {
  timer.stop();
  setAccessToken("");
  navigate("/");
};
