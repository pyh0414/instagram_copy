import { GraphQLServer } from "graphql-yoga";

import resolvers from "./resolvers";
import prisma from "./prisma";

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers,
	context(request) {
		return {
			prisma,
		};
	},
});

const options = {
	cors: {
		crediential: true,
		origin: "*",
	},
	endpoint: "/graphql",
};

server.start(options, () => {
	console.log("The server 4000 port is up!");
});
