import faker from "faker";
import { PrismaClient } from "@prisma/client";
import { request } from "graphql-request";

const prisma = new PrismaClient();

const createUser = `
mutation($user: createUserInput!) {
    createUser(user: $user)
}
`;

const getUser = `
query($userId: String!) {
	user(userId: $userId) {
		userId
		name
	}
}
`;

const testUser = {
	userId: "testUserId",
	userPw: "testPassword",
	name: "testName",
	profile: "testProfile",
};

const endPoint = "http://localhost:4000/graphql";

beforeAll(async () => {
	await prisma.user.create({
		data: testUser,
	});
});

afterAll(async () => {
	await prisma.user.delete({
		where: {
			userId: testUser.userId,
		},
	});
});

describe("User Resolver Test", () => {
	it("create user", async () => {
		const user = {
			userId: faker.random.uuid().slice(0, 10),
			userPw: faker.internet.password(),
			name: faker.name.firstName() + faker.name.lastName(),
			profile: faker.image.imageUrl(),
		};

		try {
			const res = await request(endPoint, createUser, {
				user,
			});
			expect(res).toMatchObject({
				createUser: true,
			});
		} catch (err) {
			console.log("유저가 생성되지 않았습니다.");
		}
	});

	it("get user", async () => {
		try {
			const res = await request(endPoint, getUser, {
				userId: testUser.userId,
			});

			expect(res).toMatchObject({
				user: {
					userId: testUser.userId,
					name: testUser.name,
				},
			});
		} catch (err) {
			console.log("해당 id를 가진 유저가 존재하지 않습니다.");
		}
	});
});
