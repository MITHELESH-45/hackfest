import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validation
        if (!username || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, password, and role'
            });
        }

        // Find user by username and role
        const user = await User.findOne({ username: username.toLowerCase(), role });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials or role mismatch'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials or role mismatch'
            });
        }

        // Populate role-specific fields for frontend display
        if (user.role === 'JUDGE' && user.assignedTheme) {
            await user.populate('assignedTheme', 'name');
        }
        if (user.role === 'PARTICIPANT' && user.teamId) {
            await user.populate({ path: 'teamId', select: 'name themeId', populate: { path: 'themeId', select: 'name' } });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Prepare user object (password excluded via toJSON method)
        const userObj = user.toJSON();

        res.json({
            success: true,
            token,
            user: userObj
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        // Get user with password
        const user = await User.findById(req.user._id);

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        user.isFirstLogin = false;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password change'
        });
    }
};

// @desc    Logout (client-side operation)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};
