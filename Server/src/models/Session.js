import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['initializing', 'active', 'completed'],
            default: 'initializing',
        },
        startTime: {
            type: Date,
            default: Date.now,
        },
        conceptTree: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
        messages: [
            {
                type: mongoose.Schema.Types.Mixed,
            }
        ],
        depthScores: {
            type: Map,
            of: Number,
            default: {},
        },
        blindSpots: [
            {
                type: String,
            }
        ],
        score: {
            type: Number,
            default: 0,
        },
        duration: {
            type: String,
            default: '0m',
        },
        concepts: [
            {
                type: String,
            }
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);
