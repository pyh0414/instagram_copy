import bcrypt from "bcryptjs";

export default (password: string): Promise<String> => {
	return bcrypt.hash(password, 10);
};
