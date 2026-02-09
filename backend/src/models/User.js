import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 1 // Initial password = username (may be short); after first login user sets longer password
    },
    role: {
        type: String,
        enum: ['ADMIN', 'JUDGE', 'PARTICIPANT'],
        required: [true, 'Role is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    isFirstLogin: {
        type: Boolean,
        default: true
    },
    // Judge-specific fields
    assignedTheme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme',
        required: function () { return this.role === 'JUDGE'; }
    },
    // Participant-specific fields
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: function () { return this.role === 'PARTICIPANT'; }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
