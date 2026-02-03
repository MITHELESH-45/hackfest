export const generateCredential = (role, name) => {
    const prefix = role === 'JUDGE' ? 'judge' : 'team';
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 5);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    const username = `${prefix}_${cleanName}_${randomSuffix}`;

    // Generate random password
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#";
    let password = "";
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return { username, password };
};
