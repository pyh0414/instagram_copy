import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { SINGLE_FILE_UPLOAD } from "./type";

import uploadFile from "../../utils/uploadFile";
import removeFile from "../../utils/removeFile";

@Resolver()
export class FileResolver {
	@Query((returns) => String, { nullable: true })
	async fileRemove(
		@Arg("src")
		src: string
	) {
		try {
			const result: boolean = await removeFile(src);
			return result ? src : "";
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	}

	@Mutation((returns) => String!, { nullable: false })
	async singleFileUpload(
		@Arg("file", () => GraphQLUpload)
		file: SINGLE_FILE_UPLOAD
	) {
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
