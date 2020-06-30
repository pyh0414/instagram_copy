import React from "react";
import gql from "graphql-tag";
import { Router } from "@reach/router";
import { useQuery } from "@apollo/react-hooks";
import { useApolloClient } from "@apollo/react-hooks";

import Pages from "./pages";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

import { ALL_POSTS_INFO } from "./type";

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
				name
				profile
			}
			images {
				id
				src
			}
			likers {
				user {
					id
					userId
					name
					profile
				}
			}
			comments {
				id
				content
				postId
				author {
					id
					userId
					name
					profile
				}
			}
		}
	}
`;

const App = () => {
	const client = useApolloClient();

	const { data, loading } = useQuery(IS_LOGGED_IN);
	useQuery(GET_ALL_POSTS, {
		context: {
			headers: {
				authorization: "Bearer pass",
			},
		},
		onCompleted: async ({ getAllPosts: allPosts }) => {
			await client.writeQuery({
				query: ALL_POSTS_INFO,
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
