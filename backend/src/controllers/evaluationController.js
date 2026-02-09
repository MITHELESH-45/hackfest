import Evaluation from '../models/Evaluation.js';
import Team from '../models/Team.js';
import User from '../models/User.js';

// @desc    Submit evaluation
// @route   POST /api/evaluations
// @access  Private (Judge only)
export const submitEvaluation = async (req, res) => {
    try {
        const { teamId, round, score, criteria, feedback } = req.body;

        if (!teamId || !round || score === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide teamId, round, and score'
            });
        }

        // Verify judge can only evaluate teams in their assigned theme
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Check if judge's theme matches team's theme
        if (req.user.assignedTheme.toString() !== team.themeId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only evaluate teams in your assigned theme'
            });
        }

        // Create evaluation
        const evaluation = await Evaluation.create({
            teamId,
            judgeId: req.user._id,
            round,
            score,
            criteria,
            feedback
        });

        await evaluation.populate(['teamId', 'judgeId']);

        res.status(201).json({
            success: true,
            data: evaluation
        });
    } catch (error) {
        // Handle duplicate evaluation
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already evaluated this team in this round'
            });
        }

        console.error('Submit evaluation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error submitting evaluation'
        });
    }
};

// @desc    Get evaluations by judge
// @route   GET /api/evaluations/judge
// @access  Private (Judge only)
export const getJudgeEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({ judgeId: req.user._id })
            .populate('teamId', 'name themeId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: evaluations
        });
    } catch (error) {
        console.error('Get judge evaluations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching evaluations'
        });
    }
};

// @desc    Get evaluations by team
// @route   GET /api/evaluations/team/:teamId
// @access  Private (Admin only)
export const getTeamEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({ teamId: req.params.teamId })
            .populate('judgeId', 'name')
            .sort({ round: 1, createdAt: -1 });

        res.json({
            success: true,
            data: evaluations
        });
    } catch (error) {
        console.error('Get team evaluations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching evaluations'
        });
    }
};

// @desc    Get all evaluations
// @route   GET /api/evaluations/all
// @access  Private (Admin only)
export const getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find()
            .populate('teamId', 'name themeId')
            .populate('judgeId', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: evaluations
        });
    } catch (error) {
        console.error('Get all evaluations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching evaluations'
        });
    }
};

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Private (Admin only)
export const getLeaderboard = async (req, res) => {
    try {
        // Get all teams
        const teams = await Team.find().populate('themeId', 'name');

        // Get all evaluations
        const evaluations = await Evaluation.find();

        // Calculate scores per team
        const leaderboard = teams.map(team => {
            const teamEvals = evaluations.filter(
                e => e.teamId.toString() === team._id.toString()
            );

            // Group by round
            const r1Evals = teamEvals.filter(e => e.round === 1);
            const r2Evals = teamEvals.filter(e => e.round === 2);
            const r3Evals = teamEvals.filter(e => e.round === 3);

            // Calculate averages
            const r1Avg = r1Evals.length > 0
                ? r1Evals.reduce((sum, e) => sum + e.score, 0) / r1Evals.length
                : 0;
            const r2Avg = r2Evals.length > 0
                ? r2Evals.reduce((sum, e) => sum + e.score, 0) / r2Evals.length
                : 0;
            const r3Avg = r3Evals.length > 0
                ? r3Evals.reduce((sum, e) => sum + e.score, 0) / r3Evals.length
                : 0;

            const totalScore = r1Avg + r2Avg + r3Avg;

            return {
                teamId: team._id,
                teamName: team.name,
                theme: team.themeId?.name || 'N/A',
                r1Avg: parseFloat(r1Avg.toFixed(2)),
                r2Avg: parseFloat(r2Avg.toFixed(2)),
                r3Avg: parseFloat(r3Avg.toFixed(2)),
                totalScore: parseFloat(totalScore.toFixed(2)),
                r1Count: r1Evals.length,
                r2Count: r2Evals.length,
                r3Count: r3Evals.length
            };
        });

        // Sort by total score descending
        leaderboard.sort((a, b) => b.totalScore - a.totalScore);

        res.json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error generating leaderboard'
        });
    }
};
