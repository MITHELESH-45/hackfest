import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Theme name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    maxTeams: {
        type: Number,
        default: null // null means unlimited
    }
}, {
    timestamps: true
});

// Virtual for counting assigned teams
themeSchema.virtual('teamCount', {
    ref: 'Team',
    localField: '_id',
    foreignField: 'themeId',
    count: true
});

// Enable virtuals in JSON
themeSchema.set('toJSON', { virtuals: true });
themeSchema.set('toObject', { virtuals: true });

const Theme = mongoose.model('Theme', themeSchema);

export default Theme;
