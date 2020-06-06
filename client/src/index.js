import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

import { createUploadLink } from "apollo-upload-client";

import "antd/dist/antd.css"; // or 'antd/dist/antd.less' // antd를 사용하기 위함
import App from "./App";

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: createUploadLink({ uri: "http://localhost:4000/graphql" }),
	connectToDevTools: true,
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
);
