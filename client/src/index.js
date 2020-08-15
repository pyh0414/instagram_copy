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
import { setContext } from "apollo-link-context";

import "antd/dist/antd.css"; // or 'antd/dist/antd.less' // antd를 사용하기 위함
import App from "./App";
import { inMemoryAccessToken } from "./auth/auth";
import { Timer } from "./auth/timer";

export const timer = new Timer();
const cache = new InMemoryCache();

// new WebSocketLink return WebSocketLink
const wsLink = new WebSocketLink({
  uri: `ws://${process.env.REACT_APP_SERVER_DOMAIN}/graphql`,
  options: {
    reconnect: true,
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${inMemoryAccessToken}`,
    },
  };
});

// createUploadLink return apolloLink
const httpWithUploadLink = createUploadLink({
  uri: `http://${process.env.REACT_APP_SERVER_DOMAIN}/graphql`,
  credentials: "include",
});

// split function return apolloLink
const link = split(
  ({ query }) => {
    // query : DocumnetNode type
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
  link: authLink.concat(link),
  cache,
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

// setupPersistence();

cache.writeData({
  data: {
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
