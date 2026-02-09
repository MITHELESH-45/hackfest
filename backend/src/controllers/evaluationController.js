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
        const team = await Team.findById(teamId).lean();
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Compare theme IDs (team.themeId is ObjectId; req.user.assignedTheme is ObjectId)
        const teamThemeId = String(team.themeId?._id || team.themeId);
        const judgeThemeId = String(req.user.assignedTheme?._id || req.user.assignedTheme);
        if (teamThemeId !== judgeThemeId) {
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

// @desc    Get my team's evaluation status (which rounds have been evaluated)
// @route   GET /api/evaluations/my-team
// @access  Private (Participant only)
export const getMyTeamEvaluationStatus = async (req, res) => {
    try {
        const teamId = req.user.teamId;
        if (!teamId) {
            return res.status(400).json({
                success: false,
                message: 'No team assigned'
            });
        }
        const evaluations = await Evaluation.find({ teamId }).select('round').lean();
        const rounds = [1, 2, 3];
        const status = {};
        rounds.forEach(r => {
            status[`round${r}Completed`] = evaluations.some(e => e.round === r);
        });
        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('Get my team evaluation status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
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
        const teams = await Team.find().populate('themeId', 'name');
        const evaluations = await Evaluation.find().select('teamId round score').lean();

        const leaderboard = teams.map(team => {
            const teamIdStr = team._id.toString();
            const teamEvals = evaluations.filter(e => {
                const eid = e.teamId?._id || e.teamId;
                return eid && String(eid) === teamIdStr;
            });

            const r1Evals = teamEvals.filter(e => e.round === 1);
            const r2Evals = teamEvals.filter(e => e.round === 2);
            const r3Evals = teamEvals.filter(e => e.round === 3);

            const r1Avg = r1Evals.length > 0
                ? r1Evals.reduce((sum, e) => sum + e.score, 0) / r1Evals.length
                : 0;
            const r2Avg = r2Evals.length > 0
                ? r2Evals.reduce((sum, e) => sum + e.score, 0) / r2Evals.length
                : 0;
            const r3Avg = r3Evals.length > 0
                ? r3Evals.reduce((sum, e) => sum + e.score, 0) / r3Evals.length
                : 0;

            // Overall score = average of the three round averages (for ranking)
            const roundsWithScores = [r1Avg, r2Avg, r3Avg].filter(v => v > 0).length;
            const overallAvg = roundsWithScores > 0
                ? (r1Avg + r2Avg + r3Avg) / 3
                : 0;

            return {
                teamId: team._id,
                teamName: team.name,
                theme: team.themeId?.name || 'N/A',
                r1Avg: parseFloat(r1Avg.toFixed(2)),
                r2Avg: parseFloat(r2Avg.toFixed(2)),
                r3Avg: parseFloat(r3Avg.toFixed(2)),
                overallAvg: parseFloat(overallAvg.toFixed(2)),
                r1Count: r1Evals.length,
                r2Count: r2Evals.length,
                r3Count: r3Evals.length
            };
        });

        // Sort by overall average descending
        leaderboard.sort((a, b) => b.overallAvg - a.overallAvg);

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
