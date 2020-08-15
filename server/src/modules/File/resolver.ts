import { Resolver, Mutation, Arg, Query, Authorized } from "type-graphql";
import { GraphQLUpload } from "../../utils/graphqlUpload";
import AWS from "aws-sdk";

import { SINGLE_FILE_UPLOAD } from "./type";

import uploadFile from "../../utils/uploadFile";
import removeFile from "../../utils/removeFile";
import { s3UploadFile } from "../../utils/s3UploadFile";
import { link } from "fs";

@Resolver()
export class FileResolver {
  @Authorized()
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

  @Mutation((returns) => [String]!, { nullable: false })
  async singleFileUpload(
    @Arg("file", () => GraphQLUpload)
    file: SINGLE_FILE_UPLOAD
  ) {
    try {
      const filePath = await uploadFile(file);
      const result = [];
      result.push(filePath);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  @Authorized()
  @Mutation((returns) => [String]!, { nullable: false })
  async multipleFileUpload(
    @Arg("files", () => [GraphQLUpload!]!)
    files: Array<[string, any]>
  ) {
    try {
      const result: Array<string> = await Promise.all(
        files.map((v) => uploadFile(v))
      );
      return result;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}
