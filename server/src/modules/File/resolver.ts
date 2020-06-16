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
		try {
			return new Promise(async (resolve, reject) => {
				const path = `images/${filename}`;
				createReadStream()
					.pipe(createWriteStream(path))
					.on("finish", () => resolve(path))
					.on("error", () => reject(""));
			});
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	}
}
