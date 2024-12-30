import { NextFunction, Request, Response } from "express";
import { decode } from "@auth/core/jwt";

import ErrorHandler from "./errorHandler.js";
import { Socket } from "socket.io";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cookieName =
    process.env.ENVIRONMENT === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
  const token = req.cookies[cookieName];
  console.log(cookieName, " : ", token);
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource!", 401));
  }

  try {
    const user = await decode({
      token,
      secret: process.env.AUTH_SECRET!,
      salt: cookieName,
    });
    if (!user) {
      return next(
        new ErrorHandler("Please login to access this resource!", 401),
      );
    }
    req.user = user;

    next();
  } catch (error: any) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this resource!", 401));
  }
};

export const socketMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const cookieName =
    process.env.ENVIRONMENT === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

  const cookies = socket.handshake.headers.cookie;
  const token = cookies
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith(`${cookieName}=`))
    ?.split("=")[1];
  console.log(cookieName, " : ", token);
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource!", 401));
  }

  try {
    const user = await decode({
      token,
      secret: process.env.AUTH_SECRET!,
      salt: cookieName,
    });

    if (!user) {
      return next(
        new ErrorHandler("Please login to access this resource!", 401),
      );
    }
    socket.data.user = user;

    next();
  } catch (error: any) {
    return next(new ErrorHandler("Please login to access this resource!", 401));
  }
};
