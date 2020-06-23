import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import { createPostInput, CTX, Post } from "./type";

import getUserWithToken from "../../utils/getUserWithToken";
@Resolver()
export class PostResolver {
	@Mutation((returns) => Post, { nullable: true })
	async createPost(@Arg("post") post: createPostInput, @Ctx() ctx: CTX) {
		try {
			const { content, images } = await post;
			const { prisma } = ctx;

			const userId = await getUserWithToken(ctx);
			const user = await prisma.user.findOne({
				where: {
					userId,
				},
			});

			const newPost = await prisma.post.create({
				data: {
					content,
					author: {
						connect: {
							id: user.id,
						},
					},
				},
			});

			Promise.all(
				images.map(async (image) => {
					await prisma.image.create({
						data: {
							src: image as string,
							post: {
								connect: {
									id: newPost.id,
								},
							},
						},
					});
				})
			);

			const fullPost = await prisma.post.findOne({
				where: {
					id: newPost.id,
				},
				include: {
					images: true,
					author: true,
				},
			});
			return fullPost;
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	}

	@Query((returns) => [Post!]!, { nullable: true })
	async getAllPosts(@Ctx() ctx: CTX) {
		try {
			const { prisma } = ctx;

			const posts = await prisma.post.findMany({
				include: {
					images: true,
					author: true,
				},
			});
			return posts;
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	}
}
