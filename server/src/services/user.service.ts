import * as userRepository from "../repositories/user.repository";

import { ForbiddenError, NotFoundError } from "../errors";

export const userService = {
    async getProfile(userId: string) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError("User not found.");
        }

        // Never expose the password hash
        const { passwordHash, ...safeUser } = user;

        return safeUser;
    },

    async updateProfile(
        userId: string,
        requestingUserId: string,
        data: {
            displayName?: string;
            bio?: string;
        }
    ) {
        if (userId !== requestingUserId) {
            throw new ForbiddenError(
                "You can only update your own profile."
            );
        }

        const updatedUser = await userRepository.update(userId, data);

        // Never expose the password hash
        const { passwordHash, ...safeUser } = updatedUser;

        return safeUser;
    },
};