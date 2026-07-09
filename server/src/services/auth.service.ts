import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/user.repository";
import { env } from "../config/env";
import { ConflictError, UnauthorizedError } from "../errors/index";

export const authService = {
    async signup(email: string, password: string) {
        const existingUser = await userRepository.findByEmail(email);

        if (existingUser) {
            throw new ConflictError("Email is already registered.");
        }

        const passwordHash = await bcrypt.hash(
            password,
            env.bcryptSaltRounds
        );

        const user = await userRepository.create({
            email,
            passwordHash,
        });

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            env.jwtSecret,
            {
                expiresIn: env.jwtExpiresIn,
            }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    },

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedError("Invalid credentials.");
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            throw new UnauthorizedError("Invalid credentials.");
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            env.jwtSecret,
            {
                expiresIn: env.jwtExpiresIn,
            }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    },
};