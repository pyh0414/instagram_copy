import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import bcrypt from "bcryptjs";

import getHashedPassword from "../../utils/getHashedPassword";
import getUserWithToken from "../../utils/getUserWithToken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import {
  User,
  createUserInput,
  followUnfollowUserInput,
  updateUserInput,
  followUnfollowUserRetrun,
  signInInput,
  signInResult,
} from "./type";

import { resolverContextParameters } from "../../types";

@Resolver()
export class UserResolver {
  @Query((returns) => User, { nullable: true })
  async user(
    @Arg("userId") userId: string,
    @Ctx() ctx: resolverContextParameters
  ) {
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

  @Query((returns) => signInResult)
  async signIn(@Arg("user") user: signInInput, @Ctx() ctx: any) {
    try {
      const { prisma, response } = ctx;
      const { userId, userPw } = user;

      const fullUser = await prisma.user.findOne({
        where: {
          userId,
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

      if (!fullUser) {
        return { user: fullUser, accessToken: "", loginResult: false };
      }

      const isPasswordSame = await bcrypt.compare(userPw, fullUser.userPw);

      if (!isPasswordSame) {
        return { user: fullUser, accessToken: "", loginResult: false };
      }

      const accessToken = generateAccessToken(userId);
      const refreshToken = generateRefreshToken(userId);

      response.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: false,
      });

      await prisma.user.update({
        where: {
          userId: fullUser.userId,
        },
        data: {
          refreshToken,
        },
      });
      return { user: fullUser, accessToken, loginResult: true };
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  @Authorized()
  @Query((returns) => [User], { nullable: true })
  async searchUsers(
    @Arg("userId") userId: string,
    @Ctx() ctx: resolverContextParameters
  ) {
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

  @Authorized()
  @Mutation((returns) => followUnfollowUserRetrun, { nullable: true })
  async followUser(
    @Arg("data") data: followUnfollowUserInput,
    @Ctx() ctx: resolverContextParameters
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

  @Authorized()
  @Mutation((returns) => followUnfollowUserRetrun, { nullable: true })
  async unFollowUser(
    @Arg("data") data: followUnfollowUserInput,
    @Ctx() ctx: resolverContextParameters
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

  @Authorized()
  @Mutation((returns) => User, { nullable: true })
  async updateUser(
    @Arg("data") data: updateUserInput,
    @Ctx() ctx: resolverContextParameters
  ) {
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
  async createUser(
    @Arg("user") user: createUserInput,
    @Ctx() ctx: resolverContextParameters
  ) {
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
