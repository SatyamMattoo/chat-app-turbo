import { NextFunction, Request, Response } from "express";
import { decode } from "@auth/core/jwt";

import ErrorHandler from "./errorHandler.js";
import { Socket } from "socket.io";

const cookieName = "authjs.session-token";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[cookieName];
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
  const token = socket.handshake.auth?.token;
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
