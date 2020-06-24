import { ObjectType, Field, InputType, ID } from "type-graphql";
import express from "express";
import { PrismaClient } from "@prisma/client";

import { User } from "../User/type";

@ObjectType()
export class Comment {
	@Field((type) => ID)
	id: number;

	@Field()
	content: string;

	@Field()
	postId: number;

	// post를 만들 때 comment가 없음. 근데 getAllPosts할때는 comment를 포함하는데 이때 Comment.author가 null로 나옴. 그래서 authro를 nullable로 함.
	@Field((type) => User, { nullable: true })
	author: User;
}

@InputType()
export class createCommentInput {
	@Field()
	content: string;

	@Field()
	postId: number;
}

export type CTX = {
	request: express.Request;
	prisma: PrismaClient;
};
