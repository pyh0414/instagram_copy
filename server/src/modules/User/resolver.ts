import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User, createUserInput, CTX } from "./type";
import getHashedPassword from "../../utils/getHashedPassword";

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	async user(@Arg("id") id: string, @Ctx() ctx: CTX): Promise<User | null> {
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

	@Mutation(() => Boolean)
	async createUser(
		@Arg("user") user: createUserInput,
		@Ctx() ctx: CTX
	): Promise<Boolean> {
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
