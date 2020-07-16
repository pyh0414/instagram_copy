import "reflect-metadata";
import { ObjectType, Field, InputType, ID } from "type-graphql";
import express from "express";
import { PrismaClient } from "@prisma/client";

import { Room } from "../Room/type";
import { User } from "../User/type";

@ObjectType()
export class Chat {
	@Field()
	content: string;

	@Field((type) => User, { nullable: true })
	user?: User;

	@Field((type) => Room, { nullable: true })
	room?: Room;
}

@InputType()
export class createChatInput {
	@Field()
	content: string;

	@Field()
	roomId: number;
}

export type CTX = {
	request: express.Request;
	prisma: PrismaClient;
};
