import { Resolver, Mutation, Arg } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import { UPLOAD } from "./type";

@Resolver()
export class FileResolver {
	@Mutation(() => String)
	async uploadFile(
		@Arg("file", () => GraphQLUpload)
		{ createReadStream, filename }: UPLOAD
	): Promise<String> {
		return new Promise(async (resolve, reject) => {
			const path = `images/${filename}`;
			createReadStream()
				.pipe(createWriteStream(path))
				.on("finish", () => resolve(path))
				.on("error", () => reject(""));
		});
	}
}
