import { Stream } from "stream";

export interface UPLOAD {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => Stream;
}
