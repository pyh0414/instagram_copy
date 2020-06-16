import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User, createUserInput, signInInput, CTX, AuthPayload } from "./type";
import getHashedPassword from "../../utils/getHashedPassword";
import generateToken from "../../utils/generateToken";

@Resolver()
export class UserResolver {
	@Query((returns) => User, { nullable: true })
	async user(@Arg("userId") userId: string, @Ctx() ctx: CTX) {
		const { prisma } = ctx;
		if (userId) {
			const user = prisma.user.findOne({
				where: {
					userId,
				},
			});
			return user;
		} else {
			throw new Error("id가 존재하지 않습니다.");
		}
	}

	@Query((returns) => AuthPayload)
	async signIn(@Arg("user") user: signInInput, @Ctx() ctx: CTX) {
		const { prisma } = ctx;
		const { userId, userPw } = user;

		const fullUser = await prisma.user.findOne({
			where: {
				userId,
			},
		});
		if (!fullUser) {
			throw new Error("가입정보를 다시 확인해 주세요");
		}
		const isPasswordSame = bcrypt.compare(userPw, fullUser.userPw);

		if (!isPasswordSame) {
			throw new Error("가입정보를 다시 확인해 주세요");
		}
		const Token = generateToken(userId);

		return {
			user: fullUser,
			token: Token,
		};
	}

	@Mutation((returns) => Boolean)
	async createUser(@Arg("user") user: createUserInput, @Ctx() ctx: CTX) {
		const { userId, userPw, name, profile } = user;
		const { prisma } = ctx;

		const hashedPassword = await getHashedPassword(userPw);
		const newUser = await prisma.user.create({
			data: {
				userId,
				userPw: hashedPassword.toString(),
				name,
				profile,
			},
		});

		if (!newUser) {
			return false;
		}
		return true;
	}
}
