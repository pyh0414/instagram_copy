import getHashedPassword from "../utils/getHashedPassword";
import prisma from "../utils/generatePrismaClient";
import gqlClient from "../utils/generateGraphqlClient";

const testUser3 = {
  userId: "test3UserId",
  userPw: "test3UserPw",
  name: "test3Name",
  profile: "test3Profile",
  refreshToken: "test3RefreshToken",
};

const testUser4 = {
  userId: "test4UserId",
  userPw: "test4Password",
  name: "test4Name",
  profile: "test4Profile",
  refreshToken: "test4RefreshToken",
};

let allPostsResult;
let user3, user4;

beforeAll(async () => {
  const hashPassword1 = await getHashedPassword(testUser3.userPw);
  const hashPassword2 = await getHashedPassword(testUser4.userPw);

  user3 = await prisma.user.create({
    data: {
      userId: testUser3.userId,
      userPw: hashPassword1.toString(),
      name: testUser3.name,
      profile: testUser3.profile,
      refreshToken: testUser3.refreshToken,
    },
  });

  user4 = await prisma.user.create({
    data: {
      userId: testUser4.userId,
      userPw: hashPassword2.toString(),
      name: testUser4.name,
      profile: testUser4.profile,
      refreshToken: testUser4.refreshToken,
    },
  });

  // user3이 작성한 게시글
  const newPost = await prisma.post.create({
    data: {
      content: "testPostContent",
      author: {
        connect: {
          id: user3.id,
        },
      },
    },
  });

  // image를 생성하고 post에 연결함
  await prisma.image.create({
    data: {
      src: "testImagePath",
      post: {
        connect: {
          id: newPost.id,
        },
      },
    },
  });

  // user4이 newPost를 좋아함
  // user2가 newPost에 좋아요를 남김
  await prisma.likeToPost.create({
    data: {
      user: {
        connect: {
          id: user3.id,
        },
      },
      post: {
        connect: {
          id: newPost.id,
        },
      },
    },
  });

  allPostsResult = await prisma.post.findOne({
    where: {
      id: newPost.id,
    },
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
});

afterAll(async () => {
  await prisma.queryRaw(
    `delete from user where userId in ("${testUser3.userId}","${testUser4.userId}")`
  );
});

describe("Post Resolver ", () => {
  test("모든 게시글 조회", async () => {
    const query = `
query _allPostsTest{
  getAllPosts{
    content
    author{
      userId
      name
    }
    images{
      postId
      src
    }
    comments{
      content
      author {
        userId
        name
      }
    }
    likers{
      user{
        userId
        name
      }
    }
  }
}
`;

    const res = await gqlClient.request(query);

    expect(res["getAllPosts"].length).toBeGreaterThanOrEqual(1);
  });
  test("게시글 생성", async () => {
    const post = {
      content: "testPostContent",
      images: ["testPostContentPath"],
    };
    const query = `
mutation _createPostTest($post: createPostInput!) {
    createPost(post: $post){
      id
      content
      author {
        id
        profile
        userId
     }
     images {
       id
       src
       postId
     }
     comments {
       id
       content
       postId
       author {
         id
         userId
         profile
       }
     }
    }
}
`;

    const res = await gqlClient.request(query, { post });

    const expectCreatedPost = {
      id: res["createPost"].id,
      content: "testPostContent",
      author: {
        id: res["createPost"].author.id,
        profile: "test3Profile",
        userId: "test3UserId",
      },
      images: [
        {
          id: res["createPost"].images[0].id,
          src: "testPostContentPath",
          postId: res["createPost"].images[0].postId,
        },
      ],
      comments: [],
    };

    expect(res["createPost"]).toEqual(expectCreatedPost);
  });

  test("게시글 좋아요", async () => {
    const data = {
      userId: user4.id,
      postId: allPostsResult.id,
    };

    const query = `
mutation _likeToPostTest($data:likeOrUnlikeToPostInput!){
  likeToPost(data:$data)
}
`;

    const res = await gqlClient.request(query, { data });
    expect(res["likeToPost"]).toBe(true);
  });

  test("게시글 좋아요 취소", async () => {
    const data = {
      userId: user3.id,
      postId: allPostsResult.id,
    };

    const query = `
mutation _unLikeToPostTest($data:likeOrUnlikeToPostInput!){
  unLikeToPost(data:$data)
}
`;

    const res = await gqlClient.request(query, { data });
    expect(res["unLikeToPost"]).toBe(true);
  });
});
