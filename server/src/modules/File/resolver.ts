import { Resolver, Mutation, Arg } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import { SINGLE_FILE_UPLOAD, MULTIPLE_FILE_UPLOAD } from "./type";

import { storeUpload } from "./promise";

@Resolver()
export class FileResolver {
	@Mutation((returns) => String, { nullable: true })
	async singleFileUpload(
		@Arg("file", () => GraphQLUpload)
		{ createReadStream, filename }: SINGLE_FILE_UPLOAD
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

	@Mutation((returns) => String, { nullable: true })
	async multipleFileUpload(
		@Arg("files", () => [GraphQLUpload!]!)
		files: any
	): Promise<void> {
		const results = await Promise.all(files.map(storeUpload));
		console.log(results);
	}
}
