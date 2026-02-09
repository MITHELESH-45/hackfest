import Theme from '../models/Theme.js';
import Team from '../models/Team.js';

// @desc    Get all themes
// @route   GET /api/themes
// @access  Private
export const getAllThemes = async (req, res) => {
    try {
        const themes = await Theme.find().populate('teamCount');

        res.json({
            success: true,
            data: themes
        });
    } catch (error) {
        console.error('Get themes error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching themes'
        });
    }
};

// @desc    Create theme
// @route   POST /api/themes
// @access  Private (Admin only)
export const createTheme = async (req, res) => {
    try {
        const theme = await Theme.create(req.body);

        res.status(201).json({
            success: true,
            data: theme
        });
    } catch (error) {
        console.error('Create theme error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating theme'
        });
    }
};

// @desc    Update theme
// @route   PUT /api/themes/:id
// @access  Private (Admin only)
export const updateTheme = async (req, res) => {
    try {
        const theme = await Theme.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!theme) {
            return res.status(404).json({
                success: false,
                message: 'Theme not found'
            });
        }

        res.json({
            success: true,
            data: theme
        });
    } catch (error) {
        console.error('Update theme error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating theme'
        });
    }
};

// @desc    Delete theme
// @route   DELETE /api/themes/:id
// @access  Private (Admin only)
export const deleteTheme = async (req, res) => {
    try {
        // Check if any teams are assigned to this theme
        const teamsCount = await Team.countDocuments({ themeId: req.params.id });

        if (teamsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete theme. ${teamsCount} team(s) are assigned to it`
            });
        }

        const theme = await Theme.findByIdAndDelete(req.params.id);

        if (!theme) {
            return res.status(404).json({
                success: false,
                message: 'Theme not found'
            });
        }

        res.json({
            success: true,
            message: 'Theme deleted'
        });
    } catch (error) {
        console.error('Delete theme error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting theme'
        });
    }
};
