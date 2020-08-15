import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export interface resolverContextParameters {
  request: Request;
  response: Response;
  prisma: PrismaClient;
}

export interface returnAccessTokenType {
  refreshTokenexpirated: boolean;
  accessToken: string;
}
