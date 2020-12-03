import { GraphQLClient } from "graphql-request";

const gqlClient = new GraphQLClient("http://localhost:4000/graphql", {
  headers: {
    authorization: "test",
  },
});

export default gqlClient;
