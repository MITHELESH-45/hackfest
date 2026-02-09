import mongoose from 'mongoose';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Evaluation from '../models/Evaluation.js';
import Complaint from '../models/Complaint.js';

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
export const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('themeId', 'name')
            .populate('leaderId', 'name username');

        res.json({
            success: true,
            data: teams
        });
    } catch (error) {
        console.error('Get teams error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching teams'
        });
    }
};

// @desc    Create team with leader account
// @route   POST /api/teams
// @access  Private (Admin only)
export const createTeam = async (req, res) => {
    try {
        const { name, leaderName, themeId, username } = req.body;

        const leaderUsername = (username || leaderName.toLowerCase().replace(/\s+/g, '')).trim().toLowerCase();
        // Initial password is same as username; user changes it on first login
        const password = leaderUsername;

        // Generate IDs upfront to resolve circular dependency
        const teamIdObj = new mongoose.Types.ObjectId();
        const leaderIdObj = new mongoose.Types.ObjectId();

        // Create user account for team leader
        const leader = await User.create({
            _id: leaderIdObj,
            username: leaderUsername,
            password,
            role: 'PARTICIPANT',
            name: leaderName,
            isFirstLogin: true,
            teamId: teamIdObj
        });

        // Create team
        const team = await Team.create({
            _id: teamIdObj,
            name,
            leaderName,
            themeId,
            leaderId: leader._id,
            readiness: {
                round1: false,
                round2: false
            }
        });

        // No need to update leader again since we set teamId upfront

        // Populate theme
        await team.populate('themeId', 'name');

        res.status(201).json({
            success: true,
            data: team,
            credentials: {
                username: leader.username,
                password: leaderUsername // Initial password = username
            }
        });
    } catch (error) {
        console.error('Create team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating team'
        });
    }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (Admin only)
export const updateTeam = async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('themeId', 'name');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        res.json({
            success: true,
            data: team
        });
    } catch (error) {
        console.error('Update team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating team'
        });
    }
};

// @desc    Delete team and all related data (user, evaluations, complaints)
// @route   DELETE /api/teams/:id
// @access  Private (Admin only)
export const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const teamId = team._id;
        const leaderId = team.leaderId;

        // Delete all evaluations for this team
        await Evaluation.deleteMany({ teamId });

        // Delete all complaints by this team
        await Complaint.deleteMany({ teamId });

        // Delete team leader user account
        await User.findByIdAndDelete(leaderId);

        // Delete team
        await team.deleteOne();

        res.json({
            success: true,
            message: 'Team and all related data deleted'
        });
    } catch (error) {
        console.error('Delete team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting team'
        });
    }
};

// @desc    Toggle team readiness
// @route   POST /api/teams/:id/ready
// @access  Private (Participant or Admin)
export const toggleReadiness = async (req, res) => {
    try {
        const { round, status } = req.body;

        if (!round || typeof status !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Please provide round and status'
            });
        }

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Update readiness
        const roundKey = `round${round}`;
        team.readiness[roundKey] = status;
        await team.save();

        res.json({
            success: true,
            data: team
        });
    } catch (error) {
        console.error('Toggle readiness error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating readiness'
        });
    }
};
