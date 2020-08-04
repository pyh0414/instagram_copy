import jwtDecode from "jwt-decode";
import axios from "axios";

import { getAccessToken, setAccessToken } from "./accessToken";

export let inMemoryAccessToken = "";

export const periodicallyAuthCheck = async () => {
	if (!inMemoryAccessToken) {
		inMemoryAccessToken = getAccessToken();
		return;
	}
	const { exp } = jwtDecode(inMemoryAccessToken);
	if (Date.now() + 20000 >= exp) {
		const result = await axios.get(
			`http://${process.env.REACT_APP_SERVER_DOMAIN}/auth/accessToken`,
			{
				withCredentials: true,
			}
		);
		setAccessToken(result.data.accessToken);
		console.log(getAccessToken(), "토큰 갱신");
		inMemoryAccessToken = getAccessToken();
	}
};
