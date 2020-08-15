import { Resolver, Mutation, Arg, Query, Ctx, Authorized } from "type-graphql";

import { Comment, createCommentInput, CTX } from "./type";
import getUserWithToken from "../../utils/getUserWithToken";
@Resolver()
export class CommentResolver {
  @Authorized()
  @Mutation((returns) => Comment, { nullable: true })
  async createComment(
    @Arg("comment")
    comment: createCommentInput,
    @Ctx() ctx: CTX
  ) {
    try {
      const { content, postId } = comment;
      const { prisma } = ctx;

      const userId = await getUserWithToken(ctx);
      const user = await prisma.user.findOne({
        where: {
          userId,
        },
      });
      const newComment = await prisma.comment.create({
        data: {
          content,
          author: {
            connect: {
              id: user.id,
            },
          },
          Post: {
            connect: {
              id: postId,
            },
          },
        },
      });

      const fullComment = await prisma.comment.findOne({
        where: {
          id: newComment.id,
        },
        include: {
          author: true,
        },
      });
      return fullComment;
    } catch (err) {
      console.log(err);
    }
  }
}
