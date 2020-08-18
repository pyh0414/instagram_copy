import "reflect-metadata";
import { ObjectType, Field, InputType, ID } from "type-graphql";
import express from "express";
import { PrismaClient } from "@prisma/client";

import { Post } from "../Post/type";
import { Room } from "../Room/type";
import { Chat } from "../Chat/type";

@ObjectType()
export class User {
  @Field((type) => ID)
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  userPw: string;

  @Field()
  profile: string;

  @Field({ nullable: true })
  createAt?: Date;

  @Field((type) => [Post], { nullable: true }) // generic types(promise, arrays)에 대해서는 따로 명시해 주어여함
  myPosts?: Post[]; // posts는 user를 생성할 때 없을 수 있기 때문에 nullable: true와 ?를 붙여줘야함

  @Field((type) => [User], { nullable: true }) // 유저를 생성할 때 follower가 없다
  follower?: User[];

  @Field((type) => [User], { nullable: true }) // 유저를 생성할 때 following 없다
  following?: User[];

  @Field((type) => [Room], { nullable: true })
  possessedRooms?: Room[];

  @Field((type) => [Chat], { nullable: true })
  chats?: Chat[];
}

@InputType()
export class updateUserInput {
  @Field()
  name: string;

  @Field()
  userPw: string;

  @Field()
  profile: string;
}

@InputType()
export class signInInput {
  @Field()
  userId: string;

  @Field()
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

@InputType()
export class followUnfollowUserInput {
  @Field()
  me: number;

  @Field()
  you: number;
}

@ObjectType()
export class followUnfollowUserRetrun {
  @Field()
  me: User;

  @Field()
  you: User;
}

@ObjectType()
export class signInResult {
  @Field((type) => User, { nullable: true })
  user: User;

  @Field({ nullable: true })
  accessToken: string;

  @Field()
  loginResult: boolean;
}
