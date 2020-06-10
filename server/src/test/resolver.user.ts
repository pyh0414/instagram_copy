import faker from "faker";
import { request } from "graphql-request";
import prisma from "../prisma";

const createUser = `
mutation($user: createUserInput!) {
    createUser(user: $user)
}
`;

const testUser = {
	id: "testUserId",
	name: "testName",
	profile: "testProfile",
	password: "testPassword",
};

const endPoint = "http://localhost:4000/graphql";

beforeAll(async () => {
	await prisma.mutation.createUser({
		data: testUser,
	});
});

afterAll(async () => {
	await prisma.mutation.deleteUser({
		where: {
			id: testUser.id,
		},
	});
});

describe("User Resolver Test", () => {
	it("create user", async (): Promise<void> => {
		const user = {
			id: faker.random.uuid().slice(0, 10),
			name: faker.name.firstName() + faker.name.lastName(),
			password: faker.internet.password(),
			profile: faker.image.imageUrl(),
		};

		const res = await request(endPoint, createUser, {
			user,
		});
		expect(res).toMatchObject({
			createUser: true,
		});
	});
});
