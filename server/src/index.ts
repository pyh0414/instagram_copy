import "reflect-metadata";

import { buildSchema } from "type-graphql";
import { GraphQLServer } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-Parser";
import { verify } from "jsonwebtoken";

import { UserResolver } from "./modules/User/resolver";
import { FileResolver } from "./modules/File/resolver";
import { PostResolver } from "./modules/Post/resolver";
import { CommentResolver } from "./modules/Comment/resolver";
import { RoomResolver } from "./modules/Room/resolver";
import { ChatResolver } from "./modules/Chat/resolver";

import { authMiddleware } from "./middleware/authMiddleware";
import auth from "./route/auth";

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
        const authorization = context.request.headers.authorization;
        // test 모드일 경우는 pass
        if (authorization == "test") {
          return true;
        }
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
    context({ request, response }) {
      // { request, response, connection } shape
      return {
        request,
        response,
        prisma,
      };
    },
  });

  server.express.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  server.express.use(express.json());
  server.express.use(cookieParser());

  server.express.use("/images", express.static("images"));
  server.express.use("/auth", auth);

  const graphqlServerStartOptions = {
    cors: {
      origin: "http://localhost:3000",
    },
    endpoint: "/graphql",
    subscriptions: "/graphql",
    playground: "/graphql",
  };

  server.start(graphqlServerStartOptions, (): void => {
    console.log("🚀 app running at 4000");
  });
};

main();
