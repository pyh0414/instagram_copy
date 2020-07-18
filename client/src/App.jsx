import React from "react";
import { Router } from "@reach/router";
import { useQuery } from "@apollo/react-hooks";
import { useApolloClient } from "@apollo/react-hooks";

import Pages from "./pages";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

import { QUERY_ALL_POSTS, QUERY_ALL_ROOMS } from "./action/query";
import { VALIDATE_ALL_POSTS, VALIDATE_ALL_ROOMS } from "./typeValidate";
import { IS_LOGGED_IN } from "./action/client";

const App = () => {
	const client = useApolloClient();
	const { data } = useQuery(IS_LOGGED_IN);

	useQuery(QUERY_ALL_POSTS, {
		context: {
			headers: {
				authorization: "Bearer pass",
			},
		},
		onCompleted: (data) => {
			const allPosts = data.getAllPosts;
			client.writeQuery({
				query: VALIDATE_ALL_POSTS,
				data: {
					allPosts,
				},
			});
		},
	});

	useQuery(QUERY_ALL_ROOMS, {
		context: {
			headers: {
				authorization: "Bearer pass",
			},
		},
		onCompleted: (data) => {
			const allRooms = data.getAllRooms;
			client.writeQuery({
				query: VALIDATE_ALL_ROOMS,
				data: {
					allRooms,
				},
			});
		},
	});

	return data.isLoggedIn ? (
		<Pages />
	) : (
		<Router>
			<SignIn path="/" />
			<SignUp path="signUp" />
		</Router>
	);
};

export default App;
