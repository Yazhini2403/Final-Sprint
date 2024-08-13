import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the schema for attachments
const attachmentSchema = new mongoose.Schema({
    type: { type: String, required: true },
    url: { type: String, required: true }
}, { _id: false });

// Define the schema for tasks
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    order: Number,
    stage: String,
    index: Number,
    attachment: [attachmentSchema],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { _id: false });

// Define the schema for projects
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    tasks: [taskSchema]
}, { timestamps: true });

// Define the schema for users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        return next();
    }
});

// Compare password method
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);

export { User, Project };
