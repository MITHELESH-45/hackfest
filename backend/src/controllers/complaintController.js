import Complaint from '../models/Complaint.js';

// @desc    Submit complaint
// @route   POST /api/complaints
// @access  Private (Participant only)
export const submitComplaint = async (req, res) => {
    try {
        const { type, description } = req.body;

        if (!description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide description'
            });
        }

        // Auto-attach team ID from authenticated user
        const complaint = await Complaint.create({
            teamId: req.user.teamId,
            type: type || 'OTHER',
            description,
            status: 'PENDING'
        });

        await complaint.populate('teamId', 'name leaderName');

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        console.error('Submit complaint error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error submitting complaint'
        });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin only)
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('teamId', 'name leaderName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: complaints
        });
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching complaints'
        });
    }
};

// @desc    Resolve complaint
// @route   PUT /api/complaints/:id/resolve
// @access  Private (Admin only)
export const resolveComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        complaint.status = 'RESOLVED';
        complaint.resolvedBy = req.user._id;
        complaint.resolvedAt = new Date();
        await complaint.save();

        await complaint.populate('teamId', 'name leaderName');

        res.json({
            success: true,
            data: complaint
        });
    } catch (error) {
        console.error('Resolve complaint error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error resolving complaint'
        });
    }
};
