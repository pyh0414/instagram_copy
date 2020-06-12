import jwt from "jsonwebtoken";

export default (userId: string): String => {
	return jwt.sign({ userId }, "secret", { expiresIn: "7 days" });
};
