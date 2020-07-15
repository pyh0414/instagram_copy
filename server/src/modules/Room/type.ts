import "reflect-metadata";
import { ObjectType, Field, InputType, ID } from "type-graphql";
import express from "express";
import { PrismaClient } from "@prisma/client";

import { User } from "../User/type";
import { Chat } from "../Chat/type";

export type CTX = {
	request: express.Request;
	prisma: PrismaClient;
};

@ObjectType()
export class Room {
	@Field((type) => ID)
	id: number;

	@Field()
	name: string;

	@Field((type) => User)
	owner: User;

	@Field((type) => Chat, { nullable: true })
	chats?: Chat[];
}

@ObjectType()
export class createRoomReturn {
	@Field()
	name: string;

	@Field((type) => User)
	owner: User;
}
@InputType()
export class createRoomInput {
	@Field({ nullable: false })
	name: string;
}
