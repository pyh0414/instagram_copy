import React from "react";
import { Router } from "@reach/router";

import Header from "../components/Header";
import Main from "./main";
import User from "./user";

const Pages = () => {
	return (
		<>
			<Router>
				<Main path="/" />
				<User path="/user" />
			</Router>
		</>
	);
};

export default Pages;
