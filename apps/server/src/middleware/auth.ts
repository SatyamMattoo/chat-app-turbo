import { NextFunction, Request, Response } from "express";
import { decode } from "@auth/core/jwt";

import ErrorHandler from "./errorHandler.js";
import { Socket } from "socket.io";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.get("authjs.session-token");

  if (!token) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  try {
    const user = await decode(token);

    if (!user) {
      return next(new ErrorHandler("Unauthorized", 401));
    }

    req.user = user;

    next();
  } catch (error: any) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
};

export const socketMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  try {
    const user = await decode(token);

    if (!user) {
      return next(new ErrorHandler("Unauthorized", 401));
    }
    socket.data.user = user;

    next();
  } catch (error: any) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
};
