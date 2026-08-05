import { Prisma } from "@prisma/client";
import prisma from "../prisma/client";

export async function findByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

export async function create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
        data,
    });
}

export async function findById(id: string) {
    return prisma.user.findUnique({
        where: { id },
    });
}

export async function update(
    id: string,
    data: {
        displayName?: string;
        bio?: string;
    }
) {
    return prisma.user.update({
        where: { id },
        data,
    });
}