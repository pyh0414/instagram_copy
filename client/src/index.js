import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less' // antd를 사용하기 위함

import App from "./App";

const client = new ApolloClient({
	uri: "https://48p1r2roz4.sse.codesandbox.io", // graphql server endpoint
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
);
