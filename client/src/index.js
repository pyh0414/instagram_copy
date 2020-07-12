import React from "react";
import ReactDOM from "react-dom";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";

import "antd/dist/antd.css"; // or 'antd/dist/antd.less' // antd를 사용하기 위함
import App from "./App";

const cache = new InMemoryCache();

const wsLink = new WebSocketLink({
	uri: "ws://localhost:4000/graphql",
	options: {
		reconnect: true,
	},
});

const httpWithUploadLink = createUploadLink({
	uri: "http://localhost:4000/graphql",
});

const link = split(
	// split based on operation type
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	httpWithUploadLink
);

const client = new ApolloClient({
	cache,
	link,
	connectToDevTools: true,
	resolvers: {},
});

// const client = new ApolloClient({
// 	cache,
// 	link: createUploadLink({
// 		uri: "http://localhost:4000/graphql",
// 	}),
// 	connectToDevTools: true,
// 	resolvers: {},
// });

cache.writeData({
	data: {
		isLoggedIn: false,
		user: null,
		allPosts: [],
		otherUser: null,
	},
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,

	document.getElementById("root")
);
