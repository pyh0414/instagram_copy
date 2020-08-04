import express from "express";
import { PrismaClient } from "@prisma/client";
import {
	generateAccessToken,
	generateRefreshToken,
} from "../utils/generateToken";
import bcrypt from "bcryptjs";
import jwtDecode from "jwt-decode";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

router.get(
	"/accessToken",
	async (req: express.Request, res: express.Response, next: any) => {
		const refreshToken = req.cookies.refreshToken;
		const { exp: refreshTokenValidTime } = await jwtDecode(refreshToken);
		const { userId } = await jwt.decode(refreshToken);

		let refreshTokenexpirated = false;

		if (Date.now() > refreshTokenValidTime) {
			// 만기된 경우
			const newRefreshToken = generateRefreshToken(userId);
			res.cookie("refreshToken", newRefreshToken, {
				maxAge: 12 * 60 * 24 * 30 * 60 * 1000, // 1 year
				httpOnly: true,
				secure: false,
			});
			refreshTokenexpirated = true;
		}
		const newAccessToken = generateAccessToken(userId);
		console.log(newAccessToken, "재발급");
		return res.send({
			refreshTokenexpirated: false,
			accessToken: newAccessToken,
		});
	}
);

// 로그인 경우, accessToken와 refreshToken(cookie에 담아서) 보낸다.
router.post(
	"/login",
	async (req: express.Request, res: express.Response, next: any) => {
		const { userId, userPw } = req.body.user;

		try {
			const fullUser = await prisma.user.findOne({
				where: {
					userId,
				},
				include: {
					following: true,
					follower: true,
					myPosts: {
						include: {
							images: true,
							author: true,
							likers: {
								include: {
									user: true,
								},
							},
							comments: {
								include: {
									author: true,
								},
							},
						},
					},
				},
			});
			if (!fullUser) {
				return res.send({ success: false });
			}

			const isPasswordSame = await bcrypt.compare(userPw, fullUser.userPw);

			if (!isPasswordSame) {
				return res.send({ success: false });
			}

			const accessToken = generateAccessToken(userId);
			const refreshToken = generateRefreshToken(userId);

			await prisma.user.update({
				where: {
					userId: fullUser.userId,
				},
				data: {
					refreshToken,
				},
			});
			res.cookie("refreshToken", refreshToken, {
				maxAge: 60 * 24 * 30 * 60 * 1000, // convert from minute to milliseconds
				httpOnly: true,
				secure: false,
			});

			return res.send({
				fullUser,
				accessToken,
				success: true,
			});
		} catch (err) {
			return res.send({ success: false });
		}
	}
);

router.post(
	"/auth/logout",
	async (req: express.Request, res: express.Response, next: any) => {
		try {
			res.cookie("refreshToken", "");
		} catch (err) {
			res.status(500);
		}
	}
);

export default router;
