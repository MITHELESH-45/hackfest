import User from '../models/User.js';

// Seed admin account on startup
export const seedAdmin = async () => {
    try {
        // Check if admin exists
        const adminExists = await User.findOne({ username: 'admin' });

        if (!adminExists) {
            // Create admin account
            const admin = await User.create({
                username: 'admin',
                password: 'admin3005',
                role: 'ADMIN',
                name: 'System Administrator',
                isFirstLogin: false
            });

            console.log('✅ Admin account created successfully');
        } else {
            console.log('✅ Admin account already exists');
        }
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
    }
};
