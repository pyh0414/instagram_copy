import React from "react";
import ReactDOM from "react-dom";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { persistCache } from "apollo-cache-persist";

import "antd/dist/antd.css"; // or 'antd/dist/antd.less' // antd를 사용하기 위함
import App from "./App";

const cache = new InMemoryCache();

const wsLink = new WebSocketLink({
	uri: `ws://${process.env.REACT_APP_SERVER_DOMAIN}/graphql`,
	options: {
		reconnect: true,
	},
});

const httpWithUploadLink = createUploadLink({
	uri: `http://${process.env.REACT_APP_SERVER_DOMAIN}/graphql`,
});

const link = split(
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

async function setupPersistence() {
	try {
		await persistCache({
			cache: cache,
			storage: window.localStorage,
		});
	} catch (err) {
		console.log(err);
	}
}

setupPersistence();

cache.writeData({
	data: {
		isLoggedIn: false,
		user: null,
		allPosts: [],
		otherUser: null,
		allRooms: [],
	},
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,

	document.getElementById("root")
);
