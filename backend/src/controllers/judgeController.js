import User from '../models/User.js';

// @desc    Get all judges
// @route   GET /api/judges
// @access  Private (Admin only)
export const getAllJudges = async (req, res) => {
    try {
        const judges = await User.find({ role: 'JUDGE' })
            .populate('assignedTheme', 'name')
            .select('-password');

        res.json({
            success: true,
            data: judges
        });
    } catch (error) {
        console.error('Get judges error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching judges'
        });
    }
};

// @desc    Create judge with account
// @route   POST /api/judges
// @access  Private (Admin only)
export const createJudge = async (req, res) => {
    try {
        const { name, username, assignedTheme } = req.body;

        if (!name || !username || !assignedTheme) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, username, and assigned theme'
            });
        }

        const judgeUsername = username.trim().toLowerCase();
        // Initial password is same as username; judge changes it on first login
        const password = judgeUsername;

        // Create judge account
        const judge = await User.create({
            username: judgeUsername,
            password,
            role: 'JUDGE',
            name,
            assignedTheme,
            isFirstLogin: true
        });

        await judge.populate('assignedTheme', 'name');

        res.status(201).json({
            success: true,
            data: judge.toJSON(),
            credentials: {
                username: judge.username,
                password: judgeUsername // Initial password = username
            }
        });
    } catch (error) {
        console.error('Create judge error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating judge'
        });
    }
};

// @desc    Update judge
// @route   PUT /api/judges/:id
// @access  Private (Admin only)
export const updateJudge = async (req, res) => {
    try {
        const judge = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('assignedTheme', 'name').select('-password');

        if (!judge || judge.role !== 'JUDGE') {
            return res.status(404).json({
                success: false,
                message: 'Judge not found'
            });
        }

        res.json({
            success: true,
            data: judge
        });
    } catch (error) {
        console.error('Update judge error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating judge'
        });
    }
};

// @desc    Delete judge
// @route   DELETE /api/judges/:id
// @access  Private (Admin only)
export const deleteJudge = async (req, res) => {
    try {
        const judge = await User.findById(req.params.id);

        if (!judge || judge.role !== 'JUDGE') {
            return res.status(404).json({
                success: false,
                message: 'Judge not found'
            });
        }

        await judge.deleteOne();

        res.json({
            success: true,
            message: 'Judge deleted'
        });
    } catch (error) {
        console.error('Delete judge error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting judge'
        });
    }
};
