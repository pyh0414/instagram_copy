import { ObjectType, Field, InputType, ID } from "type-graphql";
import express from "express";
import { PrismaClient } from "@prisma/client";

import { File } from "../File/type";
import { Comment } from "../Comment/type";
import { User } from "../User/type";

@ObjectType()
class Liker {
  @Field((type) => ID)
  postId: number;

  @Field((type) => ID)
  userId: number;

  @Field()
  createAt: Date;

  @Field((type) => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class Post {
  @Field((type) => ID)
  id: number;

  @Field()
  content: string;

  @Field((type) => User)
  author: User;

  @Field((type) => [File], { nullable: true })
  images?: File[];

  @Field((type) => [Comment], { nullable: true })
  comments?: Comment[];

  @Field((type) => [Liker], { nullable: true })
  likers?: Liker[];
}

@InputType()
export class createPostInput {
  @Field()
  content: string;

  @Field((type) => [String])
  images: String[];
}

@InputType()
export class likeOrUnlikeToPostInput {
  @Field()
  userId: number;

  @Field()
  postId: number;
}

export type CTX = {
  request: express.Request;
  prisma: PrismaClient;
};
