import React from "react";
import { Router } from "@reach/router";
import { useQuery } from "@apollo/react-hooks";
import { useApolloClient } from "@apollo/react-hooks";

import Pages from "./pages";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

import { QUERY_ALL_POSTS } from "./action/query";
import { VALIDATE_ALL_POSTS } from "./typeValidate";
import { IS_LOGGED_IN } from "./action/client";

const App = () => {
	const client = useApolloClient();

	const { data, loading } = useQuery(IS_LOGGED_IN);
	useQuery(QUERY_ALL_POSTS, {
		context: {
			headers: {
				authorization: "Bearer pass",
			},
		},
		onCompleted: async (data) => {
			const allPosts = data.getAllPosts;
			client.writeQuery({
				query: VALIDATE_ALL_POSTS,
				data: {
					allPosts,
				},
			});
		},
	});

	if (loading) {
		return <div>loading....</div>;
	}

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
