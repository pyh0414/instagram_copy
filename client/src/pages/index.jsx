import React, { Fragment } from "react";
import { Router } from "@reach/router";

import Main from "./main/main";
import Profile from "./profile/profile";
import Header from "../containers/Header";

const Pages = () => {
	return (
		<Fragment>
			<Header />
			<Router>
				<Main path="/" />
				<Profile path="/profile" />
			</Router>
		</Fragment>
	);
};

export default Pages;
