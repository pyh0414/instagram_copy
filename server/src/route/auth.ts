import express from "express";
import { PrismaClient } from "@prisma/client";
import jwtDecode from "jwt-decode";

import { generateAccessToken } from "../utils/generateToken";
import { returnAccessTokenType } from "../types";

const prisma = new PrismaClient();
const router = express.Router();

router.get(
  "/accessToken",
  async (
    req: express.Request,
    res: express.Response,
    next: any
  ): Promise<express.Response<returnAccessTokenType> | void> => {
    try {
      const refreshToken: String = req.cookies.refreshToken;
      const { exp: refreshTokenValidTime, userId } = await jwtDecode(
        refreshToken
      );

      //  refreshToken이 만료되었으면 logout
      if (Date.now() >= refreshTokenValidTime * 1000) {
        console.log("refreshToken 만료");
        await prisma.user.update({
          where: {
            userId,
          },
          data: {
            refreshToken: "",
          },
        });
        return res.send({
          refreshTokenexpirated: true,
          accessToken: "",
        });
      }

      const result = await prisma.user.findOne({
        where: {
          userId,
        },
        select: {
          refreshToken: true,
        },
      });
      const dbRefreshToken: String = result.refreshToken;

      // client,db의 refreshToken이 다르면 logout
      if (dbRefreshToken !== refreshToken) {
        await prisma.user.update({
          where: {
            userId,
          },
          data: {
            refreshToken: "",
          },
        });
        return res.send({
          refreshTokenexpirated: true,
          accessToken: "",
        });
      }
      const newAccessToken = generateAccessToken(userId);
      return res.send({
        refreshTokenexpirated: false,
        accessToken: newAccessToken,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get(
  "/logout",
  async (
    req: express.Request,
    res: express.Response,
    next: any
  ): Promise<any> => {
    return res.clearCookie("refreshToken");
  }
);

export default router;
