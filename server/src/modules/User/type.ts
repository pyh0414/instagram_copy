import { ObjectType, Field, ID } from "type-graphql";
import { Prisma } from "prisma-binding";
import express from "express";

@ObjectType()
export class User {
	@Field(() => ID)
	id: number;

	@Field()
	name: string;

	@Field()
	password: string;

	@Field()
	profile: string;
}

export interface CTX {
	request: express.Request;
	prisma: Prisma;
}
