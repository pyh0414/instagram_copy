import bcrypt from "bcryptjs";

export default async (password: string): Promise<String> => {
  return await bcrypt.hash(password, 10);
};
