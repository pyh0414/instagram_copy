import React, { useState, useCallback } from "react";
import { Router } from "@reach/router";

import Pages from "./pages";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

const App = () => {
	const [loginStatus, setLoginStatus] = useState(false);

	const onLoginStatus = useCallback(() => {
		setLoginStatus(true);
	}, [loginStatus]);

	return loginStatus ? (
		<Pages />
	) : (
		<Router>
			<SignIn onLoginStatus={onLoginStatus} path="/" />
			<SignUp path="signUp" />
		</Router>
	);
};

export default App;
