import { GraphQLServer } from "graphql-yoga";
import express from "express";

import resolvers from "./resolvers";
import prisma from "./prisma";

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers,
	context(request) {
		return {
			prisma,
			request,
		};
	},
});

server.express.use("/images", express.static("images"));

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
