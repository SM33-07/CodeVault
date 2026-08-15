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

export async function findByProvider(provider: string, providerId: string) {
    return prisma.user.findFirst({
        where: {
            provider,
            providerId,
        },
    });
}

export async function upsertOAuthUser(data: {
    email: string;
    displayName?: string;
    avatarUrl?: string;
    provider: string;
    providerId: string;
}) {
    // 1. Check if user exists by provider + providerId
    const existingByProvider = await findByProvider(data.provider, data.providerId);
    if (existingByProvider) {
        return prisma.user.update({
            where: { id: existingByProvider.id },
            data: {
                displayName: data.displayName || existingByProvider.displayName,
                avatarUrl: data.avatarUrl || existingByProvider.avatarUrl,
            },
        });
    }

    // 2. Check if user exists by email (link account)
    const existingByEmail = await findByEmail(data.email);
    if (existingByEmail) {
        return prisma.user.update({
            where: { id: existingByEmail.id },
            data: {
                provider: data.provider,
                providerId: data.providerId,
                displayName: data.displayName || existingByEmail.displayName,
                avatarUrl: data.avatarUrl || existingByEmail.avatarUrl,
            },
        });
    }

    // 3. Create fresh OAuth user
    return prisma.user.create({
        data: {
            email: data.email,
            displayName: data.displayName,
            avatarUrl: data.avatarUrl,
            provider: data.provider,
            providerId: data.providerId,
        },
    });
}

export async function update(
    id: string,
    data: {
        displayName?: string;
        bio?: string;
        avatarUrl?: string;
    }
) {
    return prisma.user.update({
        where: { id },
        data,
    });
}