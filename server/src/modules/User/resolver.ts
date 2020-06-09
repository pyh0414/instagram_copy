import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User, CTX } from "./type";

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	async user(@Arg("id") id: string, @Ctx() ctx: CTX): Promise<User | null> {
		const { request, prisma } = ctx;
		console.log(id);
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
}
