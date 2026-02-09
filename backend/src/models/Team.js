import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team name is required'],
        unique: true,
        trim: true
    },
    themeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme',
        required: [true, 'Theme is required']
    },
    leaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Team leader is required']
    },
    leaderName: {
        type: String,
        required: [true, 'Leader name is required']
    },
    members: [{
        name: String,
        email: String,
        role: String
    }],
    readiness: {
        round1: {
            type: Boolean,
            default: false
        },
        round2: {
            type: Boolean,
            default: false
        }
        // Round 3 (final) doesn't need readiness check
    }
}, {
    timestamps: true
});

// Populate theme automatically
teamSchema.pre(/^find/, function (next) {
    this.populate('themeId', 'name');
    next();
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
