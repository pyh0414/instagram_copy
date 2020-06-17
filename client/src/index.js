import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";

import userResolver from "./resolvers/user";
import typeDefs from "./types";

import "antd/dist/antd.css"; // or 'antd/dist/antd.less' // antd를 사용하기 위함
import App from "./App";

const cache = new InMemoryCache();

const client = new ApolloClient({
	cache,
	link: createUploadLink({ uri: "http://localhost:4000/graphql" }),
	resolvers: [userResolver],
	typeDefs,
	connectToDevTools: true,
});

cache.writeData({
	data: {
		isLoggedIn: false,
	},
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
);
