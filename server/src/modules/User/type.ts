import "reflect-metadata";
import { ObjectType, Field, InputType } from "type-graphql";
import express from "express";

@ObjectType()
export class User {
	@Field({ nullable: false })
	id: string;

	@Field({ nullable: false })
	name: string;

	@Field({ nullable: false })
	password: string;

	@Field({ nullable: false })
	profile: string;
}

@InputType()
export class createUserInput {
	@Field({ nullable: false })
	id: string;

	@Field({ nullable: false })
	name: string;

	@Field({ nullable: false })
	password: string;

	@Field({ nullable: false })
	profile: string;
}

export interface CTX {
	request: express.Request;
	prisma: any;
}
