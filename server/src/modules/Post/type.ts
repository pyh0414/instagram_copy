import { ObjectType, Field, InputType, ID } from "type-graphql";
import express from "express";
import { PrismaClient } from "@prisma/client";

import { File } from "../File/type";
import { Comment } from "../Comment/type";
import { User } from "../User/type";

// type Post {
// 	id: ID! @id @default(autoincrement())
// 	content: String!
// 	createdAt: DateTime! @createdAt
// 	comment: [Comment!]!
// 	author: User! @relation(link: INLINE, name: "UserToPost", onDelete: CASCADE)
// 	hashtag: [HashTag!]!
// 		@relation(link: TABLE, name: "HashtagToPost", onDelete: SET_NULL)
// 	images: [Image!]
// 	post: [User!]! @relation(name: "LikeToPost", onDelete: CASCADE)
// }

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
}

@InputType()
export class createPostInput {
	@Field()
	content: string;

	@Field((type) => [String])
	images: String[];
}

export type CTX = {
	request: express.Request;
	prisma: PrismaClient;
};
