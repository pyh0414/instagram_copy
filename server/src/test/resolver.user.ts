import faker from "faker";
import { PrismaClient } from "@prisma/client";
import { GraphQLClient } from "graphql-request";

import getHashedPassword from "../utils/getHashedPassword";

const prisma = new PrismaClient();

const client = new GraphQLClient("http://localhost:4000/graphql", {
  headers: {
    authorization: "test",
  },
});

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

// 아이디 중복체크
const userDuplicateCheck = ` 
query _userDuplicateCheckTest($userId: String!) {
	user(userId: $userId) {
		userId
		name
	}
}
`;

// 로그인
const signIn = ` 
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

// 유저 검색
const searchUser = ` 
query _searchUserTest($userId: String!) {
  searchUsers(userId: $userId){
    userId
  }
}
`;

// 사용자 생성
const createUser = ` 
	mutation _createUserTest($user: createUserInput!) {
		createUser(user: $user)
	}
`;

// 팔로우
const follow = ` 
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

// 팔로우
const unFollow = ` 
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
  await prisma.user.delete({
    where: {
      userId: testUser1.userId,
    },
  });
  await prisma.user.delete({
    where: {
      userId: testUser2.userId,
    },
  });
});

describe("User Resolver ", () => {
  test("사용자 생성", async () => {
    const user = {
      userId: faker.random.uuid().slice(0, 10),
      userPw: faker.internet.password(),
      name: faker.name.firstName() + faker.name.lastName(),
      profile: faker.image.imageUrl(),
    };
    const res = await client.request(createUser, {
      user,
    });
    expect(res).toMatchObject({
      createUser: true,
    });
  });

  test("아이디 중복확인", async () => {
    const res = await client.request(userDuplicateCheck, {
      userId: testUser1.userId,
    });
    expect(res["user"].userId).toBe(testUser1.userId);
  });

  test("로그인", async () => {
    const res = await client.request(signIn, {
      user: {
        userId: testUser1.userId,
        userPw: testUser1.userPw,
      },
    });
    expect(res["signIn"].loginResult).toBe(true);
  });

  test("유저 검색", async () => {
    const res = await client.request(searchUser, {
      userId: "test",
    });
    expect(res["searchUsers"].length).toBeGreaterThan(1);
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
    // user1(me)가 user2(you)를 follow 한다
    // user1는 user2를 following
    // user1는 user1의 follower
    const res = await client.request(follow, {
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

  test("언팔로우", async () => {
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
    const res = await client.request(unFollow, {
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
