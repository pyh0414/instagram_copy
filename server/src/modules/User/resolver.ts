import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User, createUserInput, signInInput, CTX, AuthPayload } from "./type";
import getHashedPassword from "../../utils/getHashedPassword";
import generateToken from "../../utils/generateToken";

@Resolver()
export class UserResolver {
	@Query((returns) => User, { nullable: true })
	async user(@Arg("id") id: string, @Ctx() ctx: CTX) {
		const { prisma } = ctx;
		if (id) {
			const user = await prisma.query.user({
				where: {
					id,
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
		const { id, password } = user;

		const fullUser = await prisma.query.user({
			where: {
				id,
			},
		});
		console.log(fullUser);
		if (!fullUser) {
			throw new Error("가입정보를 다시 확인해 주세요");
		}
		const isPasswordSame = bcrypt.compare(password, fullUser.password);

		if (!isPasswordSame) {
			throw new Error("가입정보를 다시 확인해 주세요");
		}
		const Token = generateToken(id);

		return {
			user: fullUser,
			token: Token,
		};
	}

	@Mutation((returns) => Boolean)
	async createUser(@Arg("user") user: createUserInput, @Ctx() ctx: CTX) {
		const { id, name, password, profile } = user;
		const { prisma } = ctx;

		const hashedPassword = await getHashedPassword(password);
		const newUser = await prisma.mutation.createUser({
			data: {
				id,
				name,
				profile,
				password: hashedPassword,
			},
		});
		if (!newUser) {
			return false;
		}
		return true;
	}
}
