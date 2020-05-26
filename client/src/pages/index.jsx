import React, { Fragment } from "react";
import { Router } from "@reach/router";

import Main from "./main";
import Profile from "./profile";
import Header from "../components/Header";

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
