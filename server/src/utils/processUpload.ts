import { createWriteStream } from "fs";

export default ({ createReadStream, filename }: any) => {
	const path = `images/${filename}`;
	return new Promise((resolve, reject) =>
		createReadStream()
			.pipe(createWriteStream(path))
			.on("finish", () => resolve())
			.on("error", () => reject())
	);
};
