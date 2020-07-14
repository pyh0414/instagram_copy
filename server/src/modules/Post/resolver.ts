import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import { createPostInput, likeOrUnlikeToPostInput, CTX, Post } from "./type";

import getUserWithToken from "../../utils/getUserWithToken";
@Resolver()
export class PostResolver {
	@Mutation((returns) => Boolean)
	async likeToPost(
		@Arg("data") data: likeOrUnlikeToPostInput,
		@Ctx() ctx: CTX
	) {
		try {
			const { prisma } = ctx;
			const { userId, postId } = data;
			const likeToPost = await prisma.likeToPost.create({
				data: {
					user: {
						connect: {
							id: userId,
						},
					},
					post: {
						connect: {
							id: postId,
						},
					},
				},
			});

			if (likeToPost) {
				return true;
			}
			return null;
		} catch (err) {
			console.log(err);
		}
	}

	@Mutation((returns) => Boolean)
	async unLikeToPost(
		@Arg("data") data: likeOrUnlikeToPostInput,
		@Ctx() ctx: CTX
	) {
		try {
			const { prisma } = ctx;
			const { userId, postId } = data;

			const unLikeToPost = await prisma.likeToPost.delete({
				where: {
					postId_userId: {
						postId,
						userId,
					},
				},
			});

			if (unLikeToPost) {
				return true;
			}
			return false;
		} catch (err) {
			console.log(err);
		}
	}

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

			await Promise.all(
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
					author: {
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
					},
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
			});

			return fullPost;
		} catch (err) {
			console.log(err);
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
			});

			return posts;
		} catch (err) {
			console.log(err);
		}
	}
}
