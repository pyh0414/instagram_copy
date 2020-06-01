import { GraphQLServer } from "graphql-yoga";

import Query from "../src/resolvers/Query";
import prisma from "./prisma";
import Mutation from "./prisma";

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers: {
		Query,
	},
	context(request) {
		return {
			prisma,
		};
	},
});
