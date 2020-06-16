import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { GraphQLServer } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";

import { UserResolver } from "./modules/User/resolver";
import { FileResolver } from "./modules/File/resolver";

const main = async () => {
	const schema = await buildSchema({
		resolvers: [UserResolver, FileResolver],
	});
	const prisma = new PrismaClient();

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
