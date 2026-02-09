import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Team is required']
    },
    judgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Judge is required']
    },
    round: {
        type: Number,
        required: [true, 'Round is required'],
        min: 1,
        max: 3
    },
    score: {
        type: Number,
        required: [true, 'Score is required'],
        min: 0,
        max: 10,
        validate: {
            validator: function (value) {
                // Allow up to 2 decimal places
                return /^\d+(\.\d{1,2})?$/.test(value.toString());
            },
            message: 'Score must have at most 2 decimal places'
        }
    },
    criteria: {
        innovation: Number,
        implementation: Number,
        presentation: Number,
        impact: Number
    },
    feedback: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Compound unique index: one evaluation per team per judge per round
evaluationSchema.index({ teamId: 1, judgeId: 1, round: 1 }, { unique: true });

// Populate team and judge info
evaluationSchema.pre(/^find/, function (next) {
    this.populate('teamId', 'name themeId')
        .populate('judgeId', 'name');
    next();
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

export default Evaluation;
