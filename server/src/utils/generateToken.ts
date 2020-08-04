import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string): string => {
	return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
		expiresIn: "1m",
	});
};

export const generateRefreshToken = (userId: string): string => {
	return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
		expiresIn: "1h",
	});
};
