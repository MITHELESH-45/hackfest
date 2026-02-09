import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Team is required']
    },
    type: {
        type: String,
        enum: ['TECHNICAL', 'EVALUATION', 'OTHER'],
        default: 'OTHER'
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'RESOLVED'],
        default: 'PENDING'
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Populate team info
complaintSchema.pre(/^find/, function (next) {
    this.populate('teamId', 'name leaderName');
    next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
