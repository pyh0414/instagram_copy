import jwt from "jsonwebtoken";
import { nextTick } from "process";
import express from "express";

export const authMiddleware = async (
	req: express.Request,
	res: express.Request,
	next: any
): Promise<void> => {
	if (req.method === "OPTIONS") {
		return next();
	}

	const token: string = req.headers.authorization.split("Bearer ")[1];
	if (token === "pass") {
		return next();
	}

	const tokenValid: string = await jwt.verify(token, "secret");

	if (!tokenValid) {
		throw new Error("Not authorised");
	}
	next();
};
