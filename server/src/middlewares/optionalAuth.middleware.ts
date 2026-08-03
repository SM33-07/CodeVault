import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

interface JwtPayload {
    userId: string;
    email: string;
}

export function optionalAuth(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return next();
    }

    const token = authorization.substring(7);

    try {
        const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

        req.user = {
            id: decoded.userId,
            email: decoded.email,
        };
    } catch {
        // ignore invalid/expired tokens
    }

    next();
}