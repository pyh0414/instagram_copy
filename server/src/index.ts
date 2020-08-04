import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { GraphQLServer } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-Parser";

import { UserResolver } from "./modules/User/resolver";
import { FileResolver } from "./modules/File/resolver";
import { PostResolver } from "./modules/Post/resolver";
import { CommentResolver } from "./modules/Comment/resolver";
import { RoomResolver } from "./modules/Room/resolver";
import { ChatResolver } from "./modules/Chat/resolver";

import { authMiddleware } from "./middleware/authMiddleware";
import auth from "./route/auth";
import { verify } from "jsonwebtoken";

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
		authChecker: ({ root, args, context, info }) => {
			try {
				const authorization = context.request.request.headers.authorization;
				if (!authorization) {
					throw new Error("not authenticated");
				}
				const accessToken = authorization.split(" ")[1];
				verify(accessToken, process.env.JWT_SECRET_KEY);
			} catch (err) {
				console.log(err);
				throw new Error(err);
			}
			return true;
		},
		validate: false,
	});
	const prisma = new PrismaClient();

	const server = new GraphQLServer({
		schema,
		context(request: express.Request, response: express.Response) {
			return {
				prisma,
				request,
			};
		},
	});

	server.express.use(
		cors({
			credentials: true,
			origin: true,
		})
	);
	server.express.use(express.json());
	server.express.use(cookieParser());

	server.express.use("/images", express.static("images"));
	server.express.use("/auth", auth);
	const options = {
		endpoint: "/graphql",
		subscriptions: "/graphql",
		playground: "/graphql",
	};

	server.start(options, (): void => {
		console.log("🚀 app running at 4000");
	});
};

main();
