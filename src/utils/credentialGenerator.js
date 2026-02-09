// Generates a unique username. Initial password is always the same as username (user changes on first login).
export const generateCredential = (role, name) => {
    const prefix = role === 'JUDGE' ? 'judge' : 'team';
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 5);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    const username = `${prefix}_${cleanName}_${randomSuffix}`;
    return { username, password: username };
};
