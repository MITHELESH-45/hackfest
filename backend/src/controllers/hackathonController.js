import Hackathon from '../models/Hackathon.js';
import Timeline from '../models/Timeline.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Theme from '../models/Theme.js';

// @desc    Get hackathon configuration
// @route   GET /api/hackathon/config
// @access  Private
export const getConfig = async (req, res) => {
    try {
        let hackathon = await Hackathon.findOne();

        // If no config exists, create default
        if (!hackathon) {
            hackathon = await Hackathon.create({
                name: 'Hackathon 2026',
                description: 'Welcome to the hackathon',
                startDate: new Date(),
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours later
                currentRound: 1,
                roundStatus: {
                    round1: 'ACTIVE',
                    round2: 'LOCKED',
                    round3: 'LOCKED'
                }
            });
        }

        res.json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        console.error('Get config error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching configuration'
        });
    }
};

// @desc    Update hackathon configuration
// @route   PUT /api/hackathon/config
// @access  Private (Admin only)
export const updateConfig = async (req, res) => {
    try {
        let hackathon = await Hackathon.findOne();

        if (!hackathon) {
            hackathon = await Hackathon.create(req.body);
        } else {
            Object.assign(hackathon, req.body);
            await hackathon.save();
        }

        res.json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        console.error('Update config error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating configuration'
        });
    }
};

// @desc    Get all timeline events
// @route   GET /api/hackathon/timeline
// @access  Private
export const getTimeline = async (req, res) => {
    try {
        const timeline = await Timeline.find().sort({ from: 1 });

        res.json({
            success: true,
            data: timeline
        });
    } catch (error) {
        console.error('Get timeline error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching timeline'
        });
    }
};

// @desc    Add timeline event
// @route   POST /api/hackathon/timeline
// @access  Private (Admin only)
export const addTimelineEvent = async (req, res) => {
    try {
        const event = await Timeline.create(req.body);

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Add timeline error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error adding timeline event'
        });
    }
};

// @desc    Update timeline event
// @route   PUT /api/hackathon/timeline/:id
// @access  Private (Admin only)
export const updateTimelineEvent = async (req, res) => {
    try {
        const event = await Timeline.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Timeline event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Update timeline error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating timeline event'
        });
    }
};

// @desc    Delete timeline event
// @route   DELETE /api/hackathon/timeline/:id
// @access  Private (Admin only)
export const deleteTimelineEvent = async (req, res) => {
    try {
        const event = await Timeline.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Timeline event not found'
            });
        }

        res.json({
            success: true,
            message: 'Timeline event deleted'
        });
    } catch (error) {
        console.error('Delete timeline error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting timeline event'
        });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/hackathon/stats
// @access  Private (Admin only)
export const getStats = async (req, res) => {
    try {
        const [teams, judges, themes, hackathon] = await Promise.all([
            Team.countDocuments(),
            User.countDocuments({ role: 'JUDGE' }),
            Theme.countDocuments(),
            Hackathon.findOne()
        ]);

        res.json({
            success: true,
            data: {
                teams,
                judges,
                themes,
                round: hackathon?.currentRound || 1
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching stats'
        });
    }
};
