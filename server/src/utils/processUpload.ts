import { createWriteStream } from "fs";

export default ({ createReadStream, filename }: uploadType): Promise<void> => {
	const path = `images/${filename}`;
	return new Promise<void>((resolve, reject) =>
		createReadStream()
			.pipe(createWriteStream(path))
			.on("finish", () => resolve())
			.on("error", () => reject())
	);
};

interface uploadType {
	createReadStream: Function;
	filename: string;
}
