import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { SINGLE_FILE_UPLOAD } from "./type";

import uploadFile from "../../utils/uploadFile";
import removeFile from "../../utils/removeFile";
import { s3UploadFile } from "../../utils/s3UploadFile";

import AWS from "aws-sdk";
const uuid = require("uuid/v4");

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
			throw new Error(err);
		}
	}

	@Mutation((returns) => [String]!, { nullable: true })
	async singleFileUpload(
		@Arg("file", () => GraphQLUpload!)
		file: SINGLE_FILE_UPLOAD
	) {
		try {
			await uploadFile(file);
			const filePath = [];
			filePath.push(`images/${file.filename}`);
			return filePath;
		} catch (err) {
			console.log(err);
		}
	}

	@Mutation((returns) => [String]!, { nullable: false })
	async multipleFileUpload(
		@Arg("files", () => [GraphQLUpload!]!)
		files: Array<[string, any]>
	) {
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
