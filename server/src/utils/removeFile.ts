import fs from "fs";

export default async (src): Promise<boolean> => {
	try {
		fs.unlinkSync(src);
		return true;
	} catch (err) {
		console.log(err);
		throw new Error();
	}
};
