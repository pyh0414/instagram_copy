import "reflect-metadata";
import { ObjectType, Field, InputType } from "type-graphql";
import express from "express";
import { PrismaClient } from "@prisma/client";

@ObjectType()
export class User {
	@Field({ nullable: false })
	userId: string;

	@Field({ nullable: false })
	userPw: string;

	@Field({ nullable: false })
	name: string;

	@Field({ nullable: false })
	profile: string;
}

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
	@Field({ nullable: false })
	user: User;

	@Field({ nullable: false })
	token: string;
}
