import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hackathon name is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    currentRound: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    },
    roundStatus: {
        round1: {
            type: String,
            enum: ['ACTIVE', 'COMPLETED', 'LOCKED'],
            default: 'LOCKED'
        },
        round2: {
            type: String,
            enum: ['ACTIVE', 'COMPLETED', 'LOCKED'],
            default: 'LOCKED'
        },
        round3: {
            type: String,
            enum: ['ACTIVE', 'COMPLETED', 'LOCKED'],
            default: 'LOCKED'
        }
    }
}, {
    timestamps: true
});

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

export default Hackathon;
