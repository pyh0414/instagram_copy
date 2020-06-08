import getHashedPassword from "../utils/getHashedPassword";
import processUpload from "../utils/processUpload";

export const Mutation = {
	async createUser(_: any, { user }: any, { prisma }: any, info: any) {
		const { id, name, password, profile } = user;
		const hashedPassword = await getHashedPassword(password);
		const newUser = await prisma.mutation.createUser({
			data: {
				id,
				name,
				profile,
				password: hashedPassword,
			},
		});

		return newUser;
	},
	async uploadFile(_: any, { file }: any, { prisma }: any, info: any) {
		const { createReadStream, filename } = await file;
		await processUpload({ createReadStream, filename });
		return { filePath: `images/${filename}` };
	},
};
