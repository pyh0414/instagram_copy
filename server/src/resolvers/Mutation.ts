import getHashedPassword from "../utils/getHashedPassword";
import processUpload from "../utils/processUpload";

export const Mutation = {
	async createUser(_: any, { data }: any, { prisma }: any, info: any) {
		const { id, name, password } = data;
		const hashedPassword = await getHashedPassword(password);
		const user = await prisma.mutation.createUser({
			data: {
				id,
				name,
				password: hashedPassword,
			},
		});
		return user;
	},
	async uploadFile(_: any, { file }: any, { prisma }: any, info: any) {
		const { createReadStream, filename } = await file;
		await processUpload({ createReadStream, filename });
		return { filePath: `images/${filename}` };
	},
};
