import { MiddlewareFn } from "type-graphql";
import express from "express";
import { verify } from "jsonwebtoken";

export const authMiddleware: MiddlewareFn<MyContext> = ({ context }, next) => {
	const authorization = context.req.headers["authorization"];

	if (!authorization) {
		throw new Error("not authenticated");
	}
	try {
		const token = authorization.split(" ")[1];
		const payload = verify(token, process.env.JWT_SECRET_KEY);
		context.payload = payload as any;
	} catch (err) {
		console.log(err);
		throw new Error("not authenticated");
	}
	return next();
};

export interface MyContext {
	req: express.Request;
	res: express.Response;
	payload?: { userId: string };
}
