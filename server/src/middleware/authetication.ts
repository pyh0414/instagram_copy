import jwt from "jsonwebtoken";
import { Resolver } from "./type";

export const authetication = async (
	resolve: Resolver,
	root: any,
	args: any,
	context: any,
	info: any
) => {
	try {
		const isTest =
			context.request.request.headers.authorization.split("Bearer ")[1] ||
			false;

		if (isTest === "_test") {
			//테스트 모드인 경우는 pass
			return;
		}

		const queryName: string = context.request.request.body.operationName || "";
		if (!queryName) {
			// 애초에 query name이 없으면 예외처리
			throw new Error();
		}

		const shouldPassAuth: string[] = [
			// 해당 query는 auth없이 그냥 패스
			"_signIn",
			"_signUpGetUser",
			"_signUpSingleFileUpload",
			"_signUpCreateUser",
			"_getAllPosts",
		];

		if (queryName && !shouldPassAuth.includes(queryName)) {
			const token: string = context.request.request.headers.authorization.split(
				"Bearer "
			)[1];

			if (token === "_test") {
				return;
			}
			// 해당 query가 아니면 auth
			const tokenValid: string = await jwt.verify(token, "secret");
			if (!tokenValid) {
				throw new Error();
			}
		}
	} catch (err) {
		return new Error("Not authorised");
	}
	const result = await resolve(root, args, context, info);
	return result;
};
