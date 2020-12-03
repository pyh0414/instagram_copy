import prisma from "../utils/generatePrismaClient";
import gqlClient from "../utils/generateGraphqlClient";

import getHashedPassword from "../utils/getHashedPassword";

const testUser5 = {
  userId: "test5UserId",
  userPw: "test5UserPw",
  name: "test5Name",
  profile: "test5Profile",
  refreshToken: "test5RefreshToken",
};

let user5;
let newPost;

beforeAll(async () => {
  const hashPassword1 = await getHashedPassword(testUser5.userPw);

  user5 = await prisma.user.create({
    data: {
      userId: testUser5.userId,
      userPw: hashPassword1.toString(),
      name: testUser5.name,
      profile: testUser5.profile,
      refreshToken: testUser5.refreshToken,
    },
  });

  // user5이 작성한 게시글
  newPost = await prisma.post.create({
    data: {
      content: "testPostContent",
      author: {
        connect: {
          id: user5.id,
        },
      },
    },
  });
});

afterAll(async () => {
  await prisma.queryRaw(`delete from user where userId='${user5.userId}';`);
});

describe("Comment Resolver", () => {
  test("댓글 달기", async () => {
    const comment = {
      content: "testPostComment",
      postId: newPost.id,
    };

    const query = `
mutation _createCommentTest($comment: createCommentInput!) {
    createComment(comment: $comment){
        content
        author{
            userId
        }
    }
}
`;

    const res = await gqlClient.request(query, { comment });
    expect(res["createComment"].author.userId).toBe(testUser5.userId);
  });
});
