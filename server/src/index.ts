import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { GraphQLServer } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import express from "express";
import dotenv from "dotenv";

import { UserResolver } from "./modules/User/resolver";
import { FileResolver } from "./modules/File/resolver";
import { PostResolver } from "./modules/Post/resolver";
import { CommentResolver } from "./modules/Comment/resolver";
import { RoomResolver } from "./modules/Room/resolver";
import { ChatResolver } from "./modules/Chat/resolver";

import { authMiddleware } from "./middleware/authMiddleware";

dotenv.config();

const main = async () => {
	const schema = await buildSchema({
		resolvers: [
			UserResolver,
			FileResolver,
			PostResolver,
			CommentResolver,
			RoomResolver,
			ChatResolver,
		],
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
