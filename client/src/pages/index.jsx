import React from "react";
import { Router } from "@reach/router";

import Main from "./main";
import User from "./user";
import Header from "../components/Header";

const Pages = () => {
	return (
		<>
			<Header />
			<Router>
				<Main path="/" />
				<User path="/user" />
			</Router>
		</>
	);
};

export default Pages;
