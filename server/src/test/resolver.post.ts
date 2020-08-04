import { PrismaClient } from "@prisma/client";
import { GraphQLClient, request } from "graphql-request";
import { Int } from "type-graphql";

const prisma = new PrismaClient();

const createPostQuery = `
mutation _test($post: createPostInput!) {
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

beforeAll(async () => {});

afterAll(async () => {});

xdescribe("Post Resolver Test", () => {
	it("create post", async () => {
		const post = {
			content: "testContent",
			images: ["image1", "image2", "image3"],
		};
		try {
			const res = await request(
				"http://localhost:4000/graphql",
				createPostQuery,
				{
					post,
				}
			);
			console.log(res);
		} catch (err) {
			console.log("게시글이 생성되지 않았습니다.");
		}
	});
});
