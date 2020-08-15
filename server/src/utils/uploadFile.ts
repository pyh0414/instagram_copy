import { createWriteStream, unlink } from "fs";
import { v4 as uuidv4 } from "uuid";

export default async (file): Promise<string> => {
	const { createReadStream, filename } = await file;
	const stream = createReadStream();

	const randomId = uuidv4();
	const splitted = filename.split(".");
	const imageType = splitted[splitted.length - 1];
	const path = `images/${randomId}.${imageType}`;

	// Store the file in the filesystem.
	await new Promise((resolve, reject) => {
		// Create a stream to which the upload will be written.
		const writeStream = createWriteStream(path);

		// When the upload is fully written, resolve the promise.
		writeStream.on("finish", resolve);

		// If there's an error writing the file, remove the partially written file
		// and reject the promise.
		writeStream.on("error", (error) => {
			unlink(path, () => {
				reject(error);
			});
		});
		stream.on("error", (error) => writeStream.destroy(error));
		stream.pipe(writeStream);
	});
	return path;
};
