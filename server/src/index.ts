import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { GraphQLServer } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import express from "express";

import { UserResolver } from "./modules/User/resolver";
import { FileResolver } from "./modules/File/resolver";
import { PostResolver } from "./modules/Post/resolver";
import { CommentResolver } from "./modules/Comment/resolver";

import { authMiddleware } from "./middleware/authMiddleware";

const main = async () => {
	const schema = await buildSchema({
		resolvers: [UserResolver, FileResolver, PostResolver, CommentResolver],
		validate: false,
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
	// server.express.use(authMiddleware);

	const options = {
		cors: {
			crediential: true,
			origin: "*",
		},
		endpoint: "/graphql",
		subscriptions: "/graphql",
	};

	server.start(options, (): void => {
		console.log("🚀 app running at 4000");
	});
};

main();
