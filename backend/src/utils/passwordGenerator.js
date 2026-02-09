import crypto from 'crypto';

// Generate secure random password
export const generatePassword = (length = 10) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';

    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        password += chars[randomBytes[i] % chars.length];
    }

    return password;
};
