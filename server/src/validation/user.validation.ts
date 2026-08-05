import { z } from "zod";

export const updatedProfileSchema = z.object({
    displayName: z.string().min(1).max(50).optional(),
    bio: z.string().max(500).optional(),
});

export const userParamsSchema = z.object({
    userId: z.string().uuid()
});