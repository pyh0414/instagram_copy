import React from "react";
import gql from "graphql-tag";
import { Router } from "@reach/router";
import { useQuery } from "@apollo/react-hooks";
import { useApolloClient } from "@apollo/react-hooks";

import Pages from "./pages";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

const IS_LOGGED_IN = gql`
	query {
		isLoggedIn @client
	}
`;

const GET_ALL_POSTS = gql`
	query _getAllPosts {
		getAllPosts {
			id
			content
			author {
				id
				userId
				profile
			}
			images {
				id
				src
			}
		}
	}
`;

const App = () => {
	const client = useApolloClient();

	const { data, loading } = useQuery(IS_LOGGED_IN);
	useQuery(GET_ALL_POSTS, {
		onCompleted: ({ getAllPosts }) => {
			client.writeData({
				data: {
					allPosts: getAllPosts,
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
