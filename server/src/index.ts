import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { GraphQLServer } from "graphql-yoga";

import { UserResolver } from "./modules/User/resolver";
import { FileResolver } from "./modules/File/resolver";

import prisma from "./prisma";

const main = async () => {
	const schema = await buildSchema({
		resolvers: [UserResolver, FileResolver],
	});

	const server = new GraphQLServer({
		schema,
		context(request: express.Request) {
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

	server.start(options, (): void => {
		console.log("🚀 app running at 4000");
	});
};

main();
