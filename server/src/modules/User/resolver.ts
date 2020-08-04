import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import {
	User,
	createUserInput,
	signInInput,
	CTX,
	AuthPayload,
	followUnfollowUserInput,
	updateUserInput,
	followUnfollowUserRetrun,
} from "./type";
import getHashedPassword from "../../utils/getHashedPassword";
import getUserWithToken from "../../utils/getUserWithToken";

@Resolver()
export class UserResolver {
	@Query((returns) => User, { nullable: true })
	async user(@Arg("userId") userId: string, @Ctx() ctx: CTX) {
		try {
			const { prisma } = ctx;
			const user = prisma.user.findOne({
				where: {
					userId,
				},
			});
			return user;
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	}

	@Query((returns) => [User], { nullable: true })
	async searchUsers(@Arg("userId") userId: string, @Ctx() ctx: CTX) {
		try {
			const { prisma } = ctx;
			const user = prisma.user.findMany({
				where: {
					userId: {
						contains: userId,
					},
				},
				include: {
					following: true,
					follower: true,
					myPosts: {
						include: {
							images: true,
							author: true,
							likers: {
								include: {
									user: true,
								},
							},
							comments: {
								include: {
									author: true,
								},
							},
						},
					},
				},
			});

			return user;
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	}

	@Mutation((returns) => followUnfollowUserRetrun, { nullable: true })
	async followUser(
		@Arg("data") data: followUnfollowUserInput,
		@Ctx() ctx: CTX
	) {
		try {
			const { prisma } = ctx;
			const { me, you } = data;

			await prisma.user.update({
				where: {
					id: me,
				},
				data: {
					following: {
						connect: {
							id: you,
						},
					},
				},
			});

			const user1 = await prisma.user.findOne({
				where: {
					id: me,
				},
				include: {
					following: true,
				},
			});

			const user2 = await prisma.user.findOne({
				where: {
					id: you,
				},
				include: {
					follower: true,
				},
			});
			return {
				me: user1,
				you: user2,
			};
		} catch (err) {
			console.log(err);
			throw new Error("err");
		}
	}

	@Mutation((returns) => followUnfollowUserRetrun, { nullable: true })
	async unFollowUser(
		@Arg("data") data: followUnfollowUserInput,
		@Ctx() ctx: CTX
	) {
		try {
			const { prisma } = ctx;
			const { me, you } = data;

			await prisma.user.update({
				where: {
					id: me,
				},
				data: {
					following: {
						disconnect: {
							id: you,
						},
					},
				},
			});

			const user1 = await prisma.user.findOne({
				where: {
					id: me,
				},
				include: {
					following: true,
				},
			});

			const user2 = await prisma.user.findOne({
				where: {
					id: you,
				},
				include: {
					follower: true,
				},
			});

			return {
				me: user1,
				you: user2,
			};
		} catch (err) {
			console.log(err);
			throw new Error("err");
		}
	}

	@Mutation((returns) => User, { nullable: true })
	async updateUser(@Arg("data") data: updateUserInput, @Ctx() ctx: CTX) {
		try {
			const { prisma } = ctx;
			const { name, userPw, profile } = data;

			const userId = await getUserWithToken(ctx);

			const result = await prisma.user.findOne({
				where: {
					userId,
				},
				select: {
					userPw: true,
				},
			});

			let password;

			if (userPw) {
				password = await getHashedPassword(userPw);
			} else {
				password = result.userPw;
			}

			const updatedUser = await prisma.user.update({
				where: {
					userId,
				},
				data: {
					profile,
					name,
					userPw: password,
				},
			});
			return updatedUser;
		} catch (err) {
			console.log(err);
			throw new Error("err");
		}
	}

	@Mutation((returns) => Boolean)
	async createUser(@Arg("user") user: createUserInput, @Ctx() ctx: CTX) {
		try {
			const { userId, userPw, name, profile } = user;
			const { prisma } = ctx;
			const hashedPassword = await getHashedPassword(userPw);
			const newUser = await prisma.user.create({
				data: {
					userId,
					userPw: hashedPassword.toString(),
					name,
					profile,
					refreshToken: "",
				},
			});
			if (!newUser) {
				return false;
			}
			return true;
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	}
}
