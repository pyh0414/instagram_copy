import "reflect-metadata";
import { ObjectType, Field, InputType } from "type-graphql";
import express from "express";
import { PrismaClient } from "@prisma/client";

import { Post } from "../Post/type";
@ObjectType()
export class User {
	@Field()
	id: number;

	@Field()
	name: string;

	@Field()
	userId: string;

	@Field()
	userPw: string;

	@Field()
	profile: string;

	@Field()
	createAt: Date;

	@Field((type) => [Post], { nullable: true }) // generic types(promise, arrays)에 대해서는 따로 명시해 주어여함
	posts?: Post[]; // posts는 user를 생성할 때 없을 수 있기 때문에 nullable: true와 ?를 붙여줘야함

	@Field((type) => [User], { nullable: true }) // 유저를 생성할 때 follower가 없다
	follower?: User[];
}

// id: ID! @id
// name: String!
// userId: String @unique
// userPw: String!
// profile: String!
// createdAt: DateTime! @createdAt
// # posts: [Post!]!
// # user: @relation(name: "LikeToPost", onDelete: CASCADE)
// # comments: [Comment!]!
// # chats: [Chat!]!
// # rooms: [Room!]!
// # following: [User!]! @relation(name: "Follow")
// # followers: [User!]! @relation(name: "Follow")

export type CTX = {
	request: express.Request;
	prisma: PrismaClient;
};

@InputType()
export class signInInput {
	@Field({ nullable: false })
	userId: string;

	@Field({ nullable: false })
	userPw: string;
}

@InputType()
export class createUserInput {
	@Field({ nullable: false })
	userId: string;

	@Field({ nullable: false })
	userPw: string;

	@Field({ nullable: false })
	name: string;

	@Field({ nullable: false })
	profile: string;
}

@ObjectType()
export class AuthPayload {
	@Field({ nullable: true })
	user: User;

	@Field({ nullable: true })
	token: string;

	@Field({ nullable: false })
	message: string;
}
