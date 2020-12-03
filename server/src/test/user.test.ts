import faker from "faker";

import getHashedPassword from "../utils/getHashedPassword";
import prisma from "../utils/generatePrismaClient";
import gqlClient from "../utils/generateGraphqlClient";

const testUser1 = {
  userId: "test1UserId",
  userPw: "test1UserPw",
  name: "test1Name",
  profile: "test1Profile",
  refreshToken: "test1RefreshToken",
};

const testUser2 = {
  userId: "test2UserId",
  userPw: "test2Password",
  name: "test2Name",
  profile: "test2Profile",
  refreshToken: "test2RefreshToken",
};

let createdTestUser;

beforeAll(async () => {
  const hashPassword1 = await getHashedPassword(testUser1.userPw);
  const hashPassword2 = await getHashedPassword(testUser2.userPw);

  await prisma.user.create({
    data: {
      userId: testUser1.userId,
      userPw: hashPassword1.toString(),
      name: testUser1.name,
      profile: testUser1.profile,
      refreshToken: testUser1.refreshToken,
    },
  });

  await prisma.user.create({
    data: {
      userId: testUser2.userId,
      userPw: hashPassword2.toString(),
      name: testUser2.name,
      profile: testUser2.profile,
      refreshToken: testUser2.refreshToken,
    },
  });
});

afterAll(async () => {
  const shouldRemoveUsers = [
    testUser1.userId,
    testUser2.userId,
    createdTestUser.userId,
  ];

  Promise.all(
    shouldRemoveUsers.map(async (userId) => {
      await prisma.user.delete({
        where: {
          userId,
        },
      });
    })
  );
});

describe("User Resolver", () => {
  test("사용자 생성", async () => {
    createdTestUser = {
      userId: faker.random.uuid().slice(0, 10),
      userPw: faker.internet.password(),
      name: faker.name.firstName() + faker.name.lastName(),
      profile: faker.image.imageUrl(),
    };

    const query = `
    mutation _createUserTest($user: createUserInput!) {
      createUser(user: $user)
    }
    `;

    const res = await gqlClient.request(query, {
      user: createdTestUser,
    });
    expect(res["createUser"]).toBe(true);
  });

  test("아이디 중복확인", async () => {
    const query = `
query _userDuplicateCheckTest($userId: String!) {
	user(userId: $userId) {
		userId
		name
	}
}
`;

    const res = await gqlClient.request(query, {
      userId: testUser1.userId,
    });
    expect(res["user"].userId).toBe(testUser1.userId);
  });

  test("로그인", async () => {
    const query = `
query _signInTest($user: signInInput!) {
	signIn(user: $user) {
    user{
      userId
      userPw
    }
    accessToken
    loginResult
	}
}
`;

    const res = await gqlClient.request(query, {
      user: {
        userId: testUser1.userId,
        userPw: testUser1.userPw,
      },
    });
    expect(res["signIn"].loginResult).toBe(true);
  });

  test("유저 검색", async () => {
    const query = `
query _searchUserTest($userId: String!) {
  searchUsers(userId: $userId){
    userId
  }
}
`;

    const res = await gqlClient.request(query, {
      userId: "test",
    });
    expect(res["searchUsers"].length).toBeGreaterThanOrEqual(1);
  });

  test("팔로우", async () => {
    const user1 = await prisma.user.findOne({
      where: {
        userId: testUser1.userId,
      },
      select: {
        id: true,
      },
    });

    const user2 = await prisma.user.findOne({
      where: {
        userId: testUser2.userId,
      },
      select: {
        id: true,
      },
    });

    // 팔로우
    const query = `
mutation _followTest($data: followUnfollowUserInput!) {
  followUser(data: $data){
    me{
      following{
        userId
      }
    }
    you{
      follower{
        userId
      }
    }
  }
}
`;

    // user1(me)가 user2(you)를 follow
    const res = await gqlClient.request(query, {
      data: {
        me: user1.id,
        you: user2.id,
      },
    });

    const followerExpected = []; // user2의 follower에는 user1이 있어야함
    followerExpected.push(res["followUser"].you.follower[0].userId);

    const followingExpected = []; // user1의 following에는 user2가 있어야함
    followingExpected.push(res["followUser"].me.following[0].userId);

    expect(followerExpected).toEqual(
      expect.arrayContaining([testUser1.userId])
    );
    expect(followingExpected).toEqual(
      expect.arrayContaining([testUser2.userId])
    );
  });

  test("팔로우 취소", async () => {
    const user1 = await prisma.user.findOne({
      where: {
        userId: testUser1.userId,
      },
      select: {
        id: true,
      },
    });

    const user2 = await prisma.user.findOne({
      where: {
        userId: testUser2.userId,
      },
      select: {
        id: true,
      },
    });

    const query = `
mutation _followTest($data: followUnfollowUserInput!) {
  unFollowUser(data: $data){
    me{
      following{
        userId
      }
    }
    you{
      follower{
        userId
      }
    }
  }
}
`;

    const res = await gqlClient.request(query, {
      data: {
        me: user1.id,
        you: user2.id,
      },
    });

    const followerExpected = res["unFollowUser"].you.follower;
    const followingExpected = res["unFollowUser"].me.following;

    expect(followerExpected).toEqual(
      expect.not.arrayContaining([testUser1.userId])
    );
    expect(followingExpected).toEqual(
      expect.not.arrayContaining([testUser2.userId])
    );
  });
});
