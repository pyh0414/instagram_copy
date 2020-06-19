import { Resolver, Mutation, Arg } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { SINGLE_FILE_UPLOAD, MULTIPLE_FILE_UPLOAD } from "./type";

import uploadFile from "../../utils/uploadFile";

@Resolver()
export class FileResolver {
	@Mutation((returns) => String!, { nullable: false })
	async singleFileUpload(
		@Arg("file", () => GraphQLUpload)
		file: SINGLE_FILE_UPLOAD
	): Promise<String> {
		try {
			await await uploadFile(file);
			return `images/${file.filename}`;
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	}

	@Mutation((returns) => [String]!, { nullable: false })
	async multipleFileUpload(
		@Arg("files", () => [GraphQLUpload!]!)
		files: Array<[string, any]>
	): Promise<Array<string>> {
		try {
			const filePaths: Array<string> = await Promise.all(
				files.map((v) => uploadFile(v))
			);
			return filePaths;
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	}
}
