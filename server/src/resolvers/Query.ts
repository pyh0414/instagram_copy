export const Query = {
	async user(parent: any, args: any, { prisma }: any, info: any) {
		if (args.query) {
			const user = await prisma.query.user(
				{
					where: {
						id: args.query,
					},
				},
				info
			);
			return user;
		} else {
			throw new Error("id가 존재하지 않습니다.");
		}
	},
};
