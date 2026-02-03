import { MOCK_USERS } from '../data/mockUsers';
import { delay } from '../utils/delay';

export const authApi = {
    login: async (username, password, role) => {
        await delay(800); // Simulate network latency

        // Find user by username and role
        // In real app, we check password hash. Here simple check.
        const user = MOCK_USERS.find(u =>
            u.username === username &&
            u.password === password &&
            u.role === role
        );

        if (!user) {
            throw new Error('Invalid credentials or role mismatch');
        }

        // Return user info sans password
        const { password: _, ...userInfo } = user;
        return {
            user: userInfo,
            token: 'mock-jwt-token-' + Date.now()
        };
    },

    changePassword: async (username, newPassword) => {
        await delay(500);
        // In a real app, updated DB. Here we just return success.
        return { success: true };
    },

    logout: async () => {
        await delay(300);
        return true;
    }
};
