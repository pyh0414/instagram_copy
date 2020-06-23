import { Stream } from "stream";
import { ObjectType, Field, InputType } from "type-graphql";

export type SINGLE_FILE_UPLOAD = {
	filename: string;
	createReadStream: () => Stream;
};

// export type MULTIPLE_FILE_UPLOAD = (
// 	map: any,
// 	filename: string,
// 	createReadStream: () => Stream
// ) => Array<[string, any]>;

// type Image {
// 	id: ID! @id @default(autoincrement())
// 	src: String!
// 	createdAt: DateTime! @createdAt
// 	post: Post! @relation(link: INLINE, onDelete: CASCADE)
// }

@ObjectType()
export class File {
	@Field()
	id: number;

	@Field()
	src: string;

	@Field()
	createAt: Date;

	@Field()
	postId: number;
}
