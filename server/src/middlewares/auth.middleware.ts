import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { UnauthorizedError } from "../errors";

interface JwtPayload {
    userId: string;
    email: string;
}

export function authMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return next(new UnauthorizedError("Unauthorized"));
    }

    const token = authorization.substring(7);

    try {
        const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

        req.user = {
            id: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch {
        next(new UnauthorizedError("Unauthorized"));
    }
}